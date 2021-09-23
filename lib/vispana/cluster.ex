defmodule Vispana.Cluster do
  @moduledoc """
  The Cluster context.
  """

  import Logger, warn: false
  alias Vispana.Cluster.Node

  alias Vispana.Cluster.VespaCluster

  alias Vispana.Cluster.ConfigCluster
  alias Vispana.Cluster.ConfigNode

  alias Vispana.Cluster.ContainerCluster
  alias Vispana.Cluster.ContainerNode

  alias Vispana.Cluster.ContentCluster
  alias Vispana.Cluster.ContentGroup
  alias Vispana.Cluster.ContentNode

  alias Vispana.Cluster.Host


  def fetch(config_host) do
    url = config_host <> "/serviceview/v1"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} ->
        {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} ->
        {:error, :not_found}
      {:error, _err} ->
        {:error, :internal_server_error}
    end
  end

  def vespa_cluster_loader(config_host) do
    {:ok, config_data} = fetch_config_data(config_host)
    {:ok, container_data} = fetch_container_data(config_host)
    {:ok, content_clusters_data} = fetch_and_aggregate_content_data(config_host)

    # config cluster data
    config_nodes = config_data["services"]
    |> Enum.map(fn(config) -> %ConfigNode{vespaId: config["index"], host: %Host{ hostname: config["hostname"] }} end)
    |> Enum.sort_by(&(&1.host.hostname))
    config_cluster = %ConfigCluster{configNodes: config_nodes}

    # container cluster data
    container_nodes = container_data["services"]
    |> Enum.map(fn(container) -> %ContainerNode{vespaId: container["index"], host: %Host{ hostname: container["hostname"]}} end)
    |> Enum.sort_by(&(&1.host.hostname))
    container_cluster = %ContainerCluster{containerNodes: container_nodes}

    # content clusters data
    content_clusters = content_clusters_data
      |> Enum.map(fn(content_cluster_data) -> build_content_cluster(content_cluster_data) end)

    %VespaCluster{configCluster: config_cluster , containerCluster: container_cluster, contentClusters: content_clusters}
  end

  def build_content_cluster(content_cluster_data) do
    content_groups = content_cluster_data["node"]
    |> Enum.group_by(fn (node) -> node["group"] end)
    |> Enum.map(fn {group, contents} -> %ContentGroup{key: group, contentNodes: build_content_nodes(contents)} end)
    |> Enum.sort_by(&(&1.key))

    cluster_id = content_cluster_data[:cluster_id]
    distributor_data = content_cluster_data[:distributor]
    partitions = if distributor_data["active_per_leaf_group"] do
      List.first(distributor_data["group"])["partitions"]
    else
      "0"
    end

    %ContentCluster{clusterId: cluster_id, contentGroups: content_groups, partitions: partitions}
  end

  def build_content_nodes(contents_data) do
    contents_data
    |> Enum.map(fn(content) -> %ContentNode{vespaId: content["key"], host: %Host{hostname: content["host"]}, distributionKey: content["key"]} end)
    |> Enum.sort_by(&(&1.host.hostname))
  end

  def list_nodes(config_host) do
    result = vespa_cluster_loader(config_host)
    IO.inspect(result)

    {:ok, admin_data} = fetch_config_data(config_host)
    {:ok, container_data} = fetch_container_data(config_host)
    {:ok, content_data} = fetch_dispatcher_data(config_host)

    admin_nodes = admin_data["services"]
      |> Enum.map(fn(admin) -> %Node{vespaId: admin["index"], hostname: admin["hostname"], serviceTypes: ["config"]} end)
      |> Enum.sort_by(&(&1.hostname))

    container_nodes = container_data["services"]
      |> Enum.map(fn(container) -> %Node{vespaId: container["index"], hostname: container["hostname"], serviceTypes: ["container"]} end)
      |> Enum.sort_by(&(&1.hostname))

    content_nodes = content_data["node"]
      |> Enum.map(fn(content) -> %Node{vespaId: content["key"], hostname: content["host"], serviceTypes: ["content"], content: %{key: content["key"], group: content["group"], port: content["port"]}} end)
      |> Enum.sort_by(&(&1.hostname))

    admin_nodes ++ container_nodes ++ content_nodes
      |> Enum.with_index(1)
      |> Enum.map(fn {node, index} -> %{node | id: index} end)
  end

  def fetch_and_aggregate_content_data(config_host) do
    {:ok, content_data} = fetch_content_cluster_names(config_host)
    {:ok, content_data
      |> Enum.map(fn(content_cluster) ->
        {:ok, dispatcher_data} = fetch_dispatcher_data(config_host, content_cluster)
        {content_cluster, dispatcher_data} end)
      |> Enum.map(fn{content_cluster, dispatcher_data} ->
        {:ok, content_distribution_data} = fetch_content_distribution_data(config_host, content_cluster)
        Map.merge(dispatcher_data, %{distributor: content_distribution_data, cluster_id: content_cluster})
      end)}
  end

  def fetch_config_data(config_host) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/admin/cluster-controllers"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} -> {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end

  def fetch_container_data(config_host) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/container"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} -> {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end

  # Fetches content clusters deployed into the vespa custer
  def fetch_content_cluster_names(config_host) do
    url = config_host <> "/config/v1/vespa.config.content.distribution/"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} ->
        cluster_names = Poison.decode!(body)["configs"]
        # ensure we trim '/' from the URI
        |> Enum.map(fn(content_cluster_url) -> String.trim(content_cluster_url, "/") end)
        |> Enum.map(fn(content_cluster_url) -> List.last(String.split(content_cluster_url, "/")) end)
        {:ok, cluster_names}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end

  # Fetches distribution keys and associated hosts
  def fetch_dispatcher_data(config_host, cluster_name) do
    url = config_host <> "/config/v1/vespa.config.search.dispatch/#{cluster_name}/search"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} -> {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end

  # Fetches distribution keys and associated hosts
  def fetch_dispatcher_data(config_host) do
    url = config_host <> "/config/v1/vespa.config.search.dispatch/episode/search"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} -> {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end

  def fetch_content_distribution_data(config_host, content_cluster) do
    url = config_host <> "/config/v1/vespa.config.content.distribution/#{content_cluster}"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} ->
        content_distribution_data = Poison.decode!(body)["cluster"][content_cluster]
        {:ok, content_distribution_data}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end

end
