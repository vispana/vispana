defmodule Vispana.Cluster do
  @moduledoc """
  The Cluster context.
  """

  import Logger, warn: false
  import XmlToMap, warn: false
  alias Vispana.Cluster.Node

  @doc """
  Returns the list of nodes.

  ## Examples

      iex> list_nodes()
      [%Node{}, ...]

  """
  def list_nodes_not_so_serious(config_host) do
    { :ok, result } = fetch(config_host)

    services = result["clusters"]
       |> Enum.flat_map(&(&1["services"]))
#      |> Enum.find(fn(val) -> val["type"] == "hosts" end)


    services
      |> Enum.group_by(&get_key(&1), &get_service_type(&1))
      |> Enum.sort_by(fn {host, _value} -> host end)
      |> Enum.with_index(1)
      |> Enum.map(fn {{host, value}, index} -> %Node{id: index, hostname: host, serviceTypes: value |> Enum.uniq |> Enum.sort } end)


  end

  def get_key(service) do
    service["host"]
  end

  def get_service_type(service) do
    service["serviceType"]
  end

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
    {:ok, services_xml} = fetch_services_xml(config_host)

    services_map = XmlToMap.naive_map(services_xml)["services"]["#content"]

    #TODO: ["configservers"] might need #content
    configserver_nodes = services_map["admin"]["#content"]["configservers"]["configserver"]
      |> Enum.map(fn(configserver_node) -> configserver_node["-hostalias"] end)
      |> Enum.sort
      |> Enum.with_index(1)
      |> Enum.map(fn {host, index} -> %Node{id: index, hostname: host, serviceTypes: ["configserver"] } end)

    Logger.log(:info, Kernel.inspect(configserver_nodes))

    container_map = services_map["container"]["nodes"]
    content_map = services_map["content"]



    { :ok, result } = fetch(config_host)
    services = result["clusters"]
       |> Enum.flat_map(&(&1["services"]))
#      |> Enum.find(fn(val) -> val["type"] == "hosts" end)


    services
      |> Enum.group_by(&get_key(&1), &get_service_type(&1))
      |> Enum.sort_by(fn {host, _value} -> host end)
      |> Enum.with_index(1)
      |> Enum.map(fn {{host, value}, index} -> %Node{id: index, hostname: host, serviceTypes: value |> Enum.uniq |> Enum.sort } end)

  end

  def fetch_services_xml(config_host) do
    url = config_host <> "/application/v2/tenant/default/application/default/environment/prod/region/default/instance/default/content/services.xml"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} -> {:ok, body}
      {:ok, %{status_code: 404}} -> {:error, :not_found}
      {:error, _err} -> {:error, :internal_server_error}
    end
  end
end
