defmodule VispanaWeb.ConfigLive.Index do
  import Logger, warn: false

  use VispanaWeb, :live_view
  alias Vispana.Cluster
  alias Vispana.Cluster.Refresher.RefreshInterval

  @impl true
  def mount(params, _session, socket) do
    config_host = params["config_host"]

    socket =
      socket
      |> assign(:refresh, %RefreshInterval{})
      |> assign_refresh_changeset()
      |> assign(:config_host, config_host)

    # load cluster data only if socket is connected
    socket =
      if connected?(socket) do
        socket
        |> assign(:is_loading, false)
        |> assign(:nodes, list_nodes(config_host))
      else
        socket
        |> assign(:is_loading, true)
      end

    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  @impl true
  def handle_event("refresh", _value, socket) do
    log(:debug, "Refresh request")
    config_host = socket.assigns()[:config_host]
    cluster_data = list_nodes(config_host)

    socket =
      socket
      |> assign(:nodes, cluster_data)

    {:noreply, socket}
  end

  @impl true
  def handle_event(
        "refresh_interval",
        %{"refresh_interval" => refresh_params},
        %{assigns: %{refresh: refresh}} = socket
      ) do
    interval = String.to_integer(Map.get(refresh_params, "interval", "-1"))
    log(:debug, "Refresh interval: #{interval}")

    changeset =
      refresh
      |> RefreshInterval.change_refresh_rate(refresh_params)
      |> Map.put(:action, :validate)

    socket =
      socket
      # Assign result to changeset for the screen & fire background process
      |> assign(:changeset, changeset)
      |> assign(:interval, interval)

    if connected?(socket) and interval > 0 do
      Process.send_after(self(), :refresh, interval)
    end

    {:noreply, socket}
  end

  @impl true
  def handle_info(:refresh, socket) do
    config_host = socket.assigns()[:config_host]
    refresh_interval = Map.get(socket.assigns(), :interval, -1)

    # if refresh interval is smaller than 0, auto refresh is off
    if refresh_interval < 1 do
      {:noreply, socket}
    else
      # swallow error in order to retrigger de update
      result =
        try do
          nodes = list_nodes(config_host)
          {:noreply, assign(socket, :nodes, nodes)}
        rescue
          e in RuntimeError ->
            error_string = Kernel.inspect(e)
            log(:warn, "Error to refresh page: #{error_string}")
            {:noreply, assign(socket, :error, error_string)}
        end

      if connected?(socket) do
        # very unlikely that this will be needed one day, but throttling
        # based on last time fetched might help with back pressure
        Process.send_after(self(), :refresh, refresh_interval)
      end

      result
    end
  end

  defp apply_action(socket, :config, _params) do
    socket
    |> assign(:page_title, "Vispana - Config Overview")
    |> assign(:node, nil)
  end

  defp list_nodes(config_host) do
    Cluster.list_nodes(config_host)
  end

  defp assign_refresh_changeset(%{assigns: %{refresh: refresh}} = socket) do
    socket
    |> assign(:changeset, RefreshInterval.change_refresh_rate(refresh))
  end
end
