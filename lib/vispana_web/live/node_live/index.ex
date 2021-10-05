defmodule VispanaWeb.NodeLive.Index do
  import Logger, warn: false

  use VispanaWeb, :live_view
  alias Vispana.Cluster

  @impl true
  def mount(params, _session, socket) do
    IO.inspect(socket)
    config_host = params["config_host"]
    cluster = list_nodes(config_host)

    socket =
      socket
      |> assign(:nodes, cluster)
      |> assign(:config_host, config_host)
      |> assign(:enable_auto_refresh, false)
      |> assign(:refresh_interval, -1)
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  @impl true
  def handle_event("refresh", _value, socket) do
    log(:info, 'Refresh request')
    config_host = socket.assigns()[:config_host]
    cluster_data = list_nodes(config_host)
    socket =
      socket
      |> assign(:nodes, cluster_data)

    {:noreply, socket}
  end

  @impl true
  def handle_event("auto_refresh", value, socket) do
    IO.inspect(value)
    refresh_interval=String.to_integer(value["interval"])
    log(:info, "Auto refresh request: " <> value["interval"])

    socket =
      socket
      |> assign(:refresh_interval, refresh_interval)

    if connected?(socket) do
      Process.send_after(self(), :refresh, refresh_interval)
    end

    {:noreply, socket}
  end

  @impl true
  def handle_info(:refresh, socket) do
    config_host = socket.assigns()[:config_host]
    refresh_interval = socket.assigns()[:refresh_interval]

    result = try do
      nodes = list_nodes(config_host)
      {:noreply, assign(socket, :nodes, nodes)}
    rescue
      e in RuntimeError ->
        error_string = Kernel.inspect(e)
        log(:info, "Error to refresh page: #{error_string}")
        {:noreply, assign(socket, :error, error_string)}
    end

    if connected?(socket) do
      # very unlikely that this will be needed one day, but throttling
      # based on last time fetched might help with back pressure
      Process.send_after(self(), :refresh, refresh_interval)
    end

    result
  end

  defp apply_action(socket, :content, _params) do
    socket
    |> assign(:page_title, "Vispana - Nodes")
    |> assign(:node, nil)
  end

  defp list_nodes(config_host) do
    Cluster.list_nodes(config_host)
  end

end
