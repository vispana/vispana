defmodule VispanaWeb.NodeLive.Index do
  import Logger, warn: false

  use VispanaWeb, :live_view
  alias Vispana.Cluster

  @impl true
  def mount(params, _session, socket) do
    config_host = params["config_host"]
    refresh_interval = if params["refresh_interval"] do params["refresh_interval"] else 30000 end
    cluster = list_nodes(config_host)
    if connected?(socket) do
      Process.send_after(self(), :refresh, refresh_interval)
    end
    socket =
      socket
      |> assign(:nodes, cluster)
      |> assign(:config_host, config_host)
      |> assign(:refresh_interval, refresh_interval)
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
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
      # base on last time fetched might help in case multiple users are
      # using vispana
      Process.send_after(self(), :refresh, refresh_interval)
    end

    result
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Vispana - Nodes")
    |> assign(:node, nil)
  end

  defp list_nodes(config_host) do
    Cluster.list_nodes(config_host)
  end

end
