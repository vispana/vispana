defmodule Vispana.Cluster do
  @moduledoc """
  The Cluster context.
  """

  import Logger, warn: false
  alias Vispana.Cluster.Node

  @doc """
  Returns the list of nodes.

  ## Examples

      iex> list_nodes()
      [%Node{}, ...]

  """
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

  def list_nodes(config_host) do
    {:ok, admin_data} = fetch_admin_data(config_host)
    {:ok, container_data} = fetch_container_data(config_host)
    {:ok, content_data} = fetch_content_data(config_host)

    admin_nodes = admin_data["services"]
      |> Enum.map(fn(admin) -> %Node{vespaId: admin["index"], hostname: admin["hostname"], serviceTypes: ["config"]} end)
      |> Enum.sort_by(&(&1.hostname))

    container_nodes = container_data["services"]
      |> Enum.map(fn(container) -> %Node{vespaId: container["index"], hostname: container["hostname"], serviceTypes: ["container"]} end)
      |> Enum.sort_by(&(&1.hostname))

    content_nodes = content_data["node"]
      |> Enum.map(fn(content) -> %Node{vespaId: content["key"], hostname: content["host"], serviceTypes: ["content"], content: %{"distribution-key": content["key"]}} end)
      |> Enum.sort_by(&(&1.hostname))

    admin_nodes ++ container_nodes ++ content_nodes
      |> Enum.with_index(1)
      |> Enum.map(fn {node, index} -> %{node | id: index} end)
  end

  def fetch_admin_data(config_host) do
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

  def fetch_content_data(config_host) do
    #TODO: find how to remove the episode from here
    url = config_host <> "/config/v1/vespa.config.search.dispatch/episode/search"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} -> {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end
end
