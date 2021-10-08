defmodule Vispana.Cluster do
  @moduledoc """
  The Cluster context.
  """

  import Logger, warn: false

  alias Vispana.Cluster.VespaCluster

  alias Vispana.Cluster.ConfigCluster
  alias Vispana.Cluster.ConfigNode

  alias Vispana.Cluster.ContainerCluster
  alias Vispana.Cluster.ContainerNode

  alias Vispana.Cluster.ContentCluster
  alias Vispana.Cluster.ContentGroup
  alias Vispana.Cluster.ContentNode

  alias Vispana.Cluster.Host
  alias Vispana.Cluster.Schema

  def list_nodes(config_host) do
    log(:info, "Fetching cluster data for config host: " <> config_host)
    cluster_data = vespa_cluster_loader(config_host)
#    cluster_data = _list_nodes_mock(config_host)
    log(:info, "Finished fetching data for config host: " <> config_host)
    cluster_data
  end

  def vespa_cluster_loader(config_host) do
    [config_data, container_data, content_clusters_data, metrics] =
      [
        Task.async(fn -> {:ok, config_data} = fetch_config_data(config_host)
                           config_data
        end),
        Task.async(fn -> {:ok, container_data} = fetch_container_data(config_host)
                           container_data
        end),
        Task.async(fn -> {:ok, content_clusters_data} = fetch_and_aggregate_content_data(config_host)
                           content_clusters_data
        end),
        Task.async(fn -> {:ok, metrics} = fetch_metrics(config_host)
                           metrics
        end),
      ]
      |> Enum.map(&Task.await/1)

    # config cluster data
    config_nodes =
      config_data["services"]
      |> Enum.map(fn config ->
        %ConfigNode{vespaId: config["index"], host: %Host{hostname: config["hostname"]}}
      end)
      |> Enum.sort_by(& &1.host.hostname)

    config_cluster = %ConfigCluster{configNodes: config_nodes}

    # container cluster data
    container_nodes =
      container_data["services"]
      |> Enum.map(fn container ->
        %ContainerNode{vespaId: container["index"], host: %Host{hostname: container["hostname"]}}
      end)
      |> Enum.sort_by(& &1.host.hostname)

    container_cluster = %ContainerCluster{containerNodes: container_nodes}

    # content clusters data
    content_clusters =
      content_clusters_data
      |> Enum.map(fn content_cluster_data ->
        build_content_cluster(content_cluster_data, metrics)
      end)

    %VespaCluster{
      configCluster: config_cluster,
      containerCluster: container_cluster,
      contentClusters: content_clusters
    }
  end

  def build_content_cluster(content_cluster_data, metrics) do
    content_groups =
      content_cluster_data["node"]
      |> Enum.group_by(fn node -> node["group"] end)
      |> Enum.map(fn {group, contents} ->
        %ContentGroup{key: group, contentNodes: build_content_nodes(contents, metrics)}
      end)
      |> Enum.sort_by(& &1.key)

    cluster_id = content_cluster_data[:cluster_id]
    distributor_data = content_cluster_data[:distributor]

    schemas =
      content_cluster_data[:schemas]
      |> Enum.map(fn schema ->
        # naive way to calculate docs for a given schema by picking the first group and summing up docs from every node in it.
        # note: this is very inefficient, but it's 1AM and I would like to finish it, if important I'll comeback to this!
        doc_count =
          List.first(content_groups).contentNodes
          |> Enum.flat_map(fn content_node ->
            # IO.inspect(content_node.metrics)
            content_node.metrics
            |> Enum.filter(fn metrics -> metrics["dimensions"]["documenttype"] == schema end)
            |> Enum.map(fn metrics ->
              docs_active =
                if metrics["values"]["content.proton.documentdb.documents.active.last"] do
                  metrics["values"]["content.proton.documentdb.documents.active.last"]
                else
                  0
                end

              docs_active
            end)
          end)
          |> Enum.sum()

        %Schema{schemaName: schema, docCount: doc_count}
      end)

    partitions =
      if distributor_data["active_per_leaf_group"] do
        partitions_notation = List.first(distributor_data["group"])["partitions"]
        # take the length of a partition notation such as *|*|*|*
        length(String.split(partitions_notation, "|"))
      else
        0
      end

    searchable_copies = distributor_data["ready_copies"]
    redundancy = distributor_data["redundancy"]

    node_count =
      content_groups
      |> Enum.map(fn(content_group) -> length(content_group.contentNodes) end)
      |> Enum.sum

    %ContentCluster{
      clusterId: cluster_id,
      contentGroups: content_groups,
      partitions: partitions,
      searchableCopies: searchable_copies,
      redundancy: redundancy,
      schemas: schemas,
      node_count: node_count
    }
  end

  def build_content_nodes(contents_data, metrics) do
    contents_data
    |> Enum.map(fn content ->
      # each host should be unique
      node_metrics = List.first(metrics[content["host"]])

      search_node_metrics =
        node_metrics["services"]
        |> Enum.filter(fn root -> root["name"] == "vespa.searchnode" end)
        |> Enum.flat_map(fn root -> root["metrics"] end)

      {content, search_node_metrics}
    end)
    |> Enum.map(fn {content, search_node_metrics} ->
      %ContentNode{
        vespaId: content["key"],
        host: %Host{hostname: content["host"]},
        distributionKey: content["key"],
        metrics: search_node_metrics
      }
    end)
    |> Enum.sort_by(& &1.host.hostname)
  end

  def fetch_and_aggregate_content_data(config_host) do
    {:ok, content_data} = fetch_content_cluster_names(config_host)

    {:ok,
     content_data
     |> Enum.map(fn content_cluster ->
       {:ok, dispatcher_data} = fetch_dispatcher_data(config_host, content_cluster)
       {:ok, schemas} = fetch_schemas(config_host, content_cluster)
       {content_cluster, dispatcher_data, schemas}
     end)
     |> Enum.map(fn {content_cluster, dispatcher_data, schemas} ->
       {:ok, content_distribution_data} =
         fetch_content_distribution_data(config_host, content_cluster)

       Map.merge(dispatcher_data, %{
         distributor: content_distribution_data,
         cluster_id: content_cluster,
         schemas: schemas
       })
     end)}
  end

  def fetch_config_data(config_host) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/admin/cluster-controllers"

    http_get(url)
    |> http_map(fn decoded_body -> decoded_body end)
  end

  def fetch_container_data(config_host) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/container"

    http_get(url)
    |> http_map(fn decoded_body -> decoded_body end)
  end

  # Fetches content clusters deployed into the vespa custer
  def fetch_content_cluster_names(config_host) do
    url = config_host <> "/config/v1/vespa.config.content.distribution/"

    http_get(url)
    |> http_map(fn decoded_body ->
      cluster_names =
        decoded_body["configs"]
        # ensure we trim '/' from the URI
        |> Enum.map(fn content_cluster_url -> String.trim(content_cluster_url, "/") end)
        |> Enum.map(fn content_cluster_url ->
          List.last(String.split(content_cluster_url, "/"))
        end)

      cluster_names
    end)
  end

  # Fetches distribution keys and associated hosts
  def fetch_dispatcher_data(config_host, cluster_name) do
    url = config_host <> "/config/v1/vespa.config.search.dispatch/#{cluster_name}/search"

    http_get(url)
    |> http_map(fn decoded_body -> decoded_body end)
  end

  def fetch_content_distribution_data(config_host, content_cluster) do
    url = config_host <> "/config/v1/vespa.config.content.distribution/#{content_cluster}"

    http_get(url)
    |> http_map(fn decoded_body -> decoded_body["cluster"][content_cluster] end)
  end

  def fetch_schemas(config_host, content_cluster) do
    url = config_host <> "/config/v1/search.config.index-info/#{content_cluster}/?recursive=true"

    http_get(url)
    |> http_map(fn decoded_body ->
      schemas =
        decoded_body["configs"]
        |> tl()
        |> Enum.map(fn schema_url -> String.trim(schema_url, "/") end)
        |> Enum.map(fn schema_url -> List.last(String.split(schema_url, "/")) end)

      schemas
    end)
  end

  def fetch_metrics(config_host) do
    url = config_host <> "/metrics/v2/values"

    http_get(url)
    |> http_map(fn decoded_body ->
      schemas =
        decoded_body["nodes"]
        |> Enum.group_by(fn node -> node["hostname"] end)

      schemas
    end)
  end

  def http_get(url) do
    timeout_ms = 30000
    headers = []
    options = [recv_timeout: timeout_ms]
    HTTPoison.get(url, headers, options)
  end

  def http_map(http_response, mapper_fn) do
    case http_response do
      {:ok, %{status_code: 200, body: body}} ->
        {:ok, mapper_fn.(Poison.decode!(body))}

      {:ok, %{status_code: 404}} ->
        {:error, :not_found}

      {:error, err} ->
        {:error, {:internal_server_error, err}}
    end
  end

  def _list_nodes_mock(_config_host) do
    %VespaCluster{
      configCluster: %ConfigCluster{
        configNodes: [
          %ConfigNode{
            host: %Host{
              hostname: "europe-config-01.vispana.com"
            },
            vespaId: 0
          },
          %ConfigNode{
            host: %Host{
              hostname: "europe-config-02.vispana.com"
            },
            vespaId: 1
          }
        ]
      },
      containerCluster: %ContainerCluster{
        containerNodes: [
          %ContainerNode{
            host: %Host{
              hostname: "europe-container-01.vispana.com"
            },
            vespaId: 0
          },
          %ContainerNode{
            host: %Host{
              hostname: "europe-container-02.vispana.com"
            },
            vespaId: 2
          }
        ]
      },
      contentClusters: [

        %ContentCluster{
          clusterId: "content-cluster-1",
          partitions: 2,
          redundancy: 3,
          searchableCopies: 4,
          node_count: 2,
          schemas: [
            %Schema{
              schemaName: "schema-1",
              docCount: 100
            },
            %Schema{
              schemaName: "schema-2",
              docCount: 200
            },
            %Schema{
              schemaName: "schema-3",
              docCount: 300
            },
            %Schema{
              schemaName: "schema-4",
              docCount: 400
            },
          ],
          contentGroups: [
            %ContentGroup{
              key: "content-group-0",
              contentNodes: [
                %ContentNode{
                  vespaId: 1,
                  distributionKey: 1,
                  host: %Host{
                    hostname: "europe-content-01.vispana.com"
                  },
                  metrics: []
                },
                %ContentNode{
                  vespaId: 2,
                  distributionKey: 2,
                  host: %Host{
                    hostname: "europe-content-02.vispana.com"
                  },
                  metrics: []
                }
              ]
            }
          ]
        },
        %ContentCluster{
          clusterId: "content-cluster-2",
          partitions: 4,
          redundancy: 5,
          searchableCopies: 6,
          node_count: 5,
          schemas: [
            %Schema{
              schemaName: "schema-5",
              docCount: 100
            },
            %Schema{
              schemaName: "schema-6",
              docCount: 200
            },
            %Schema{
              schemaName: "schema-7",
              docCount: 300
            },
          ],
          contentGroups: [
            %ContentGroup{
              key: "content-group-1",
              contentNodes: [
                %ContentNode{
                  vespaId: 1,
                  distributionKey: 1,
                  host: %Host{
                    hostname: "europe-content-01.vispana.com"
                  },
                  metrics: []
                },
                %ContentNode{
                  vespaId: 3,
                  distributionKey: 3,
                  host: %Host{
                    hostname: "europe-content-03.vispana.com"
                  },
                  metrics: []
                },
                %ContentNode{
                  vespaId: 4,
                  distributionKey: 4,
                  host: %Host{
                    hostname: "europe-content-04.vispana.com"
                  },
                  metrics: []
                }
              ]
            },
            %ContentGroup{
              key: "content-group-1",
              contentNodes: [
                %ContentNode{
                  vespaId: 5,
                  distributionKey: 5,
                  host: %Host{
                    hostname: "europe-content-05.vispana.com"
                  },
                  metrics: []
                },
                %ContentNode{
                  vespaId: 6,
                  distributionKey: 6,
                  host: %Host{
                    hostname: "europe-content-06.vispana.com"
                  },
                  metrics: []
                },
              ]
            }

          ]
        }

      ]
    }
  end
end
