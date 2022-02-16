defmodule Vispana.ClusterLoader do
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
  alias Vispana.Cluster.AppPackage
  alias Vispana.Cluster.Schema
  alias Vispana.Cluster.Metrics

  def load(config_host) do
    log(:info, "Fetching cluster data for config host: " <> config_host)
    cluster_data = vespa_cluster_loader(config_host)
    # cluster_data = _list_nodes_mock(config_host)
    log(:info, "Finished fetching data for config host: " <> config_host)
    cluster_data
  end

  defp vespa_cluster_loader(config_host) do
    [config_data, container_data, content_clusters_data, app_package,  metrics] =
      [
        start_async(fn -> fetch_config_data(config_host) end),
        start_async(fn -> fetch_and_aggregate_container_data(config_host) end),
        start_async(fn -> fetch_and_aggregate_content_data(config_host) end),
        start_async(fn -> fetch_app_package(config_host) end),
        start_async(fn -> fetch_metrics(config_host) end)
      ]
      |> Enum.map(fn task ->
          case Task.await(task, :infinity) do
            {:ok, result}  -> result
            {:error, error}  ->
              raise RuntimeError, message: Kernel.inspect(error)
          end
      end)

    %VespaCluster{
      configCluster: mount_config_cluster(config_data, metrics),
      containerClusters: mount_container_cluster(container_data, metrics),
      contentClusters: mount_content_clusters(content_clusters_data, metrics),
      appPackage: app_package
    }
  end

  defp mount_config_cluster(config_data, metrics) do
    parsed_metrics = parse_metrics(metrics)

    config_nodes =
      config_data["services"]
      |> Enum.map(fn config ->
        host = config["hostname"]
        parsed_node_metrics = parsed_metrics[host]

        %ConfigNode{
          vespaId: config["index"],
          host: %Host{hostname: host},
          status_services: parsed_node_metrics.status_services,
          cpu_usage: parsed_node_metrics.cpu_usage,
          disk_usage: parsed_node_metrics.disk_usage,
          memory_usage: parsed_node_metrics.memory_usage}
      end)
      |> Enum.sort_by(& &1.host.hostname)

    %ConfigCluster{configNodes: config_nodes}
  end

  defp mount_container_cluster(containers_data, metrics) do
      containers_data
      |> Enum.map(fn container -> build_container_cluster(container, metrics) end)
  end

  defp build_container_cluster({:ok, container_cluster_data}, metrics) do
    parsed_metrics = parse_metrics(metrics)

    container_nodes =
      container_cluster_data["services"]
      |> Enum.map(fn container ->
        host = container["hostname"]
        parsed_node_metrics = parsed_metrics[host]
        %ContainerNode{
          vespaId: container["index"],
          host: %Host{hostname: host},
          status_services: parsed_node_metrics.status_services,
          cpu_usage: parsed_node_metrics.cpu_usage,
          disk_usage: parsed_node_metrics.disk_usage,
          memory_usage: parsed_node_metrics.memory_usage}
      end)
      |> Enum.sort_by(& &1.host.hostname)

    %ContainerCluster{clusterId: container_cluster_data["clusterId"], containerNodes: container_nodes}
  end

  defp mount_content_clusters(content_clusters_data, metrics) do
    content_clusters_data
    |> Enum.map(fn content_cluster_data ->
      build_content_cluster(content_cluster_data, metrics)
    end)
  end

  defp build_content_cluster(content_cluster_data, metrics) do

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
      |> Enum.map(fn content_group -> length(content_group.contentNodes) end)
      |> Enum.sum()

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

  defp build_content_nodes(contents_data, metrics) do
    parsed_metrics = parse_metrics(metrics)

    contents_data
    |> Enum.map(fn content ->
      host = content["host"]

      # each host should be unique
      node_metrics = List.first(metrics[host])

      parsed_node_metrics = parsed_metrics[host]

      search_node_metrics =
        node_metrics["services"]
        |> Enum.filter(fn root -> root["name"] == "vespa.searchnode" end)
        |> Enum.flat_map(fn root -> root["metrics"] end)

      {content, search_node_metrics, parsed_node_metrics}
    end)
    |> Enum.map(fn {content, search_node_metrics, parsed_node_metrics} ->
      %ContentNode{
        vespaId: content["key"],
        host: %Host{hostname: content["host"]},
        distributionKey: content["key"],
        metrics: search_node_metrics,
        status_services: parsed_node_metrics.status_services,
        cpu_usage: parsed_node_metrics.cpu_usage,
        disk_usage: parsed_node_metrics.disk_usage,
        memory_usage: parsed_node_metrics.memory_usage
      }
    end)
    |> Enum.sort_by(& &1.host.hostname)
  end

  defp fetch_and_aggregate_content_data(config_host) do
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

  defp fetch_and_aggregate_container_data(config_host) do
    {:ok, container_data} = fetch_container_cluster_names(config_host)

    {:ok,
     container_data
     |> Enum.map(fn container_cluster ->
       fetch_container_data(config_host, container_cluster)
     end)}
  end

  defp fetch_config_data(config_host) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/admin/cluster-controllers"
    http_get(url)
    |> http_map(fn decoded_body -> decoded_body end, url)
  end

  defp fetch_container_data(config_host, container_cluster) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/" <> container_cluster
    http_get(url)
    |> http_map(fn decoded_body -> decoded_body end, url)
  end

  # Fetches content clusters deployed into the vespa custer
  defp fetch_container_cluster_names(config_host) do
    url = config_host <> "/config/v1/cloud.config.cluster-info/"
    http_get(url)
    |> http_map(fn decoded_body ->
      decoded_body["configs"]
      # ensure we trim '/' from the URI
      |> Enum.map(fn container_cluster_url -> String.trim(container_cluster_url, "/") end)
      |> Enum.map(fn container_cluster_url -> List.last(String.split(container_cluster_url, "/")) end)
      |> Enum.filter(fn clusterId -> clusterId != "admin" end)
      end, url)
  end

  # Fetches content clusters deployed into the vespa custer
  defp fetch_content_cluster_names(config_host) do
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
    end, url)
  end

  # Fetches distribution keys and associated hosts
  defp fetch_dispatcher_data(config_host, cluster_name) do
    url = config_host <> "/config/v1/vespa.config.search.dispatch/#{cluster_name}/search"

    http_get(url)
    |> http_map(fn decoded_body -> decoded_body end, url)
  end

  defp fetch_content_distribution_data(config_host, content_cluster) do
    url = config_host <> "/config/v1/vespa.config.content.distribution/#{content_cluster}"

    http_get(url)
    |> http_map(fn decoded_body -> decoded_body["cluster"][content_cluster] end, url)
  end

  defp fetch_schemas(config_host, content_cluster) do
    url = config_host <> "/config/v1/search.config.index-info/#{content_cluster}/?recursive=true"

    http_get(url)
    |> http_map(fn decoded_body ->
        decoded_body["configs"]
        |> tl()
        |> Enum.map(fn schema_url -> String.trim(schema_url, "/") end)
        |> Enum.map(fn schema_url -> List.last(String.split(schema_url, "/")) end)
    end, url)
  end

  # FIXME this assumes tenant is default, may cause issues for vespa cloud
  defp fetch_app_package(config_host) do
    url = config_host <> "/application/v2/tenant/default/application/?recursive=true"
    config_host <> "/ApplicationStatus"

    http_get(url)
    |> http_map(fn decoded_body ->
      if length(decoded_body) < 1 do
        :no_package
      else
        # FIXME this assumes a single app
        app_url = List.first(decoded_body)
        {:ok, result} = http_get(app_url)
        |> http_map(fn app_decoded ->
            generation = app_decoded["generation"]
            version = List.first(app_decoded["modelVersions"], "N/A")
            # TODO build time will require requesting from a /ApplicationStatus in a container instance,
            # however right now we haven't stored neither the container port nor have the means to know in
            # which container cluster we should query
            # build_time = fetch_build_time(app_url)
            schemas = fetch_schemas_content(app_url)
            hosts = fetch_hosts_content(app_url)
            services_xml = fetch_services_xml_content(app_url)

            # method that helps the UI to generalize better
            view_content = [%{title: 'services.xml', content: services_xml}, %{title: 'hosts.xml', content: hosts}]
            ++ (schemas |> Enum.map(fn {key, value} -> %{title: key, content: value} end))

            %AppPackage{generation: generation, vespaVersion: version, schemas: schemas, hosts: hosts, services: services_xml, viewContent: view_content}
        end, app_url)
        result
      end
    end, url)
  end

  defp fetch_schemas_content(app_url) do
    schemas_dir_url = app_url <> "/content/schemas/"
    # TODO figure out why I need :ok here
    {:ok, result } = http_get(schemas_dir_url)
    |> http_map(fn schemas_urls ->
      schemas_urls
      |> Enum.map(fn schema_url ->

        # parse URL to appropriate schema name
        schema_name = List.last(String.split(schema_url, "/"))
        # TODO figure out why I need :ok here
        {:ok, schema} = http_get(schema_url)
        |> http_map(fn schema -> schema end, schema_url, false)
        {schema_name, schema}
      end)
    |> Enum.into(%{})
    end, schemas_dir_url)
    result
  end

  defp fetch_services_xml_content(app_url) do
    services_url = app_url <> "/content/services.xml"
    {:ok, result} = http_get(services_url)
    |> http_map(fn services_xml -> services_xml end, services_url, false)
    result
  end

  defp fetch_hosts_content(app_url) do
    hosts_url = app_url <> "/content/hosts.xml"
    {:ok, result} = http_get(hosts_url)
    |> http_map(fn hosts_xml -> hosts_xml end, hosts_url, false)
    result
  end

  defp fetch_metrics(config_host) do
    url = config_host <> "/metrics/v2/values"

    http_get(url)
    |> http_map(fn decoded_body ->
      decoded_body["nodes"]
      |> Enum.group_by(fn node -> node["hostname"] end)
    end, url)
  end

  # Returns a map of host => %Metrics
  defp parse_metrics(metrics) do
    metrics
    |> Enum.map(fn {host, data} -> {host, parse_metrics_from_host(data)} end)
    |> Map.new(fn {host, data} -> {host, data} end)
  end

  defp parse_metrics_from_host(host_metrics) do
    host_metric = List.first(host_metrics)
    aggregated_metrics =
      host_metric["services"]
      |> Enum.map(fn service_metric_per_host ->
        service_status = {service_metric_per_host["name"], service_metric_per_host["status"]["code"]}
        metrics = service_metric_per_host["metrics"]

        # cpu_util is only available on newer versions of vespa (>7.484.7)
        cpu = List.first(metrics)["values"]["cpu_util"]
        {disk, memory} = if "vespa.searchnode" == service_metric_per_host["name"] do

          system_metrics = metrics
          |> Enum.filter(fn metric ->
            metric["values"]["content.proton.resource_usage.disk.average"] || metric["values"]["content.proton.resource_usage.memory.average"]
          end)

          if length(system_metrics) > 0 do
            proton_metrics = Enum.at(system_metrics, 0)
            disk_average = proton_metrics["values"]["content.proton.resource_usage.disk.average"]
            memory_average = proton_metrics["values"]["content.proton.resource_usage.memory.average"]
            {disk_average, memory_average}
          else
            {0.0, 0.0}
          end
        else
          {0.0, 0.0}
        end
        { service_status, cpu, memory, disk }
      end)


    {cpu, memory, disk} = aggregated_metrics
    |> Enum.reduce({0.0, 0.0, 0.0}, fn(metric, acc) ->
      {acc_cpu, acc_memory, acc_disk} = acc
      {_, cpu, memory, disk} = metric
      {ensure_metric(cpu) + acc_cpu, ensure_metric(memory) + acc_memory, ensure_metric(disk) + acc_disk}
    end)


    status = aggregated_metrics
    |> Enum.map(fn {aggregated_metrics, _, _, _} -> aggregated_metrics end)
    |> Map.new(fn {key, value} -> {key, value} end)

    %Metrics{status_services: status, cpu_usage: cpu, memory_usage: memory, disk_usage: disk}
  end

  defp ensure_metric(metric_value) do
    if  metric_value == nil do
      0
    else
      metric_value
    end
  end

  defp http_get(url) do
    timeout_ms = 30000
    headers = []
    options = [recv_timeout: timeout_ms, timeout: timeout_ms]
    HTTPoison.get(url, headers, options)
  end

  defp http_map(http_response, mapper_fn, url, decode_json \\ true) do
    case http_response do
      {:ok, %{status_code: 200, body: body}} ->
        if(decode_json) do
          {:ok, mapper_fn.(Poison.decode!(body))}
        else
          {:ok, mapper_fn.(body)}
        end
      {:ok, %{status_code: 404}} ->
        {:error, "404: " <> url}
      {:ok, %{status_code: 500}} ->
        {:error, "Vespa internal error: " <> url <> ". Error: " <> Kernel.inspect(http_response)}
      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, "HTTP call failed: " <> url <> ". Error: " <> Kernel.inspect(reason)}
    end
  end

  defp start_async(fetch_call) do
    Task.async(fn ->
      try do
        case fetch_call.() do
          {:ok, result} -> {:ok, result}
          {:error, error} -> {:error, error}
        end
      rescue
        e in RuntimeError -> {:error, e}
        e in CaseClauseError -> {:error, e}
        e in MatchError -> {:error, e}
      end
    end)
  end

  defp _list_nodes_mock(_config_host) do
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
      containerClusters: [
        %ContainerCluster{
          clusterId: "container-cluster",
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
      }],
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
              docCount: 100,
            },
            %Schema{
              schemaName: "schema-2",
              docCount: 200,
            },
            %Schema{
              schemaName: "schema-3",
              docCount: 300,
            },
            %Schema{
              schemaName: "schema-4",
              docCount: 400,
            }
          ],
          contentGroups: [
            %ContentGroup{
              key: "0",
              contentNodes: [
                %ContentNode{
                  vespaId: 1,
                  distributionKey: 1,
                  host: %Host{
                    hostname: "europe-content-01.vispana.com"
                  },
                  status_services: %{
                    "vespa.config-sentinel" => "up",
                    "vespa.distributor" => "up",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  metrics: [],
                  cpu_usage: 61,
                  memory_usage: 0.4,
                  disk_usage: 0.5
                },
                %ContentNode{
                  vespaId: 2,
                  distributionKey: 2,
                  host: %Host{
                    hostname: "europe-content-02.vispana.com"
                  },
                  status_services: %{
                    "vespa.config-sentinel" => "down",
                    "vespa.distributor" => "up",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  metrics: [],
                  cpu_usage: 31,
                  memory_usage: 0.9,
                  disk_usage: 0.8
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
              docCount: 100,
            },
            %Schema{
              schemaName: "schema-6",
              docCount: 200,
            },
            %Schema{
              schemaName: "schema-7",
              docCount: 300,
            }
          ],
          contentGroups: [
            %ContentGroup{
              key: "1",
              contentNodes: [
                %ContentNode{
                  vespaId: 1,
                  distributionKey: 1,
                  host: %Host{
                    hostname: "europe-content-01.vispana.com"
                  },
                  status_services: %{
                    "vespa.config-sentinel" => "up",
                    "vespa.distributor" => "down",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  metrics: [],
                  cpu_usage: 73,
                  memory_usage: 0.53,
                  disk_usage: 0.7
                },
                %ContentNode{
                  vespaId: 3,
                  distributionKey: 3,
                  host: %Host{
                    hostname: "europe-content-03.vispana.com"
                  },
                  status_services: %{
                    "vespa.config-sentinel" => "up",
                    "vespa.distributor" => "up",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  metrics: [],
                  cpu_usage: 20,
                  memory_usage: 0.6,
                  disk_usage: 0.9
                },
                %ContentNode{
                  vespaId: 4,
                  distributionKey: 4,
                  host: %Host{
                    hostname: "europe-content-04.vispana.com"
                  },
                  status_services: %{
                    "vespa.config-sentinel" => "up",
                    "vespa.distributor" => "up",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  metrics: [],
                  cpu_usage: 100,
                  memory_usage: 0.23,
                  disk_usage: 0.5
                }
              ]
            },
            %ContentGroup{
              key: "2",
              contentNodes: [
                %ContentNode{
                  vespaId: 5,
                  distributionKey: 5,
                  host: %Host{
                    hostname: "europe-content-05.vispana.com"
                  },
                  metrics: [],
                  status_services: %{
                    "vespa.config-sentinel" => "up",
                    "vespa.distributor" => "up",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  cpu_usage: 90,
                  memory_usage: 0.4,
                  disk_usage: 0.2
                },
                %ContentNode{
                  vespaId: 6,
                  distributionKey: 6,
                  host: %Host{
                    hostname: "europe-content-06.vispana.com"
                  },
                  status_services: %{
                    "vespa.config-sentinel" => "up",
                    "vespa.distributor" => "up",
                    "vespa.logd" => "up",
                    "vespa.metricsproxy-container" => "up",
                    "vespa.searchnode" => "up"
                  },
                  metrics: [],
                  cpu_usage: 40,
                  memory_usage: 0.4,
                  disk_usage: 0.2
                }
              ]
            }
          ]
        }
      ]
    }
  end
end
