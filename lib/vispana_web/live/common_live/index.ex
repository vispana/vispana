defmodule VispanaWeb.VispanaCommon do
  import Logger, warn: false

  use VispanaWeb, :live_view
  alias Vispana.ClusterLoader
  alias Vispana.Component.Refresher.RefreshInterval

  @impl true
  def mount(params, _session, socket) do
    log(:debug, "Started mounting...")
    config_host = params["config_host"]

    socket =
      socket
      |> assign(:refresh, %RefreshInterval{interval: -1})
      |> assign_refresh_changeset()
      |> assign(:config_host, config_host)

    # load cluster data only if socket is connected
    socket =
      if connected?(socket) do
        case vespa_cluster_load(config_host) do
          {:ok, vespa_cluster} ->
            socket
            |> assign(:is_loading, false)
            |> assign(:nodes, vespa_cluster)
          {:error, error} ->
            socket
            |> assign(:is_loading, true)
            |> put_flash(:error, error.message)
        end
      else
        # Elixir will first call this method to estabilish a connection and
        # then call mount again to update the socket if any update is available
        socket
        |> assign(:is_loading, true)
      end

    log(:debug, "Finished mounting")
    {:ok, socket}
  end

  @impl true
  def handle_params(_params, _url, socket) do
    # Sets page title
    socket =
      case socket.assigns.live_action do
        :config -> socket |> assign(:page_title, "Vispana - Config Overview")
        :container -> socket |> assign(:page_title, "Vispana - Container Overview")
        :content -> socket |> assign(:page_title, "Vispana - Content Overview")
        :apppackage -> socket |> assign(:page_title, "Vispana - App package Overview")
        :_ -> socket |> assign(:page_title, "Vispana")
      end
    {:noreply, socket}
  end

  @impl true
  def handle_event("refresh", _value, socket) do
    log(:debug, "Refresh request")
    config_host = socket.assigns()[:config_host]
    socket = case vespa_cluster_load(config_host) do
      {:ok, vespa_cluster} ->
        socket
        |> assign(:is_loading, false)
        |> assign(:nodes, vespa_cluster)
      {:error, error} ->
        socket
        |> put_flash(:error, "Failed to refresh: " <> error.message)
    end

    {:noreply, socket}
  end

  @impl true
  def handle_event(
        "refresh_interval",
        %{"refresh_interval" => refresh_params},
        %{assigns: %{refresh: refresh}} = socket
      ) do
    interval = String.to_integer(refresh_params["interval"])
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
    log(:debug, "Started handle_info...")

    config_host = socket.assigns()[:config_host]
    refresh_interval = Map.get(socket.assigns(), :interval, -1)

    # if refresh interval is smaller than 0, auto refresh is off
    if refresh_interval < 1 do
      {:noreply, socket}
    else
        socket = case vespa_cluster_load(config_host) do
          {:ok, vespa_cluster} ->
            socket
            |> assign(:is_loading, false)
            |> assign(:nodes, vespa_cluster)
          {:error, error} ->
            socket
            |> assign(:is_loading, true)
            |> put_flash(:error, "Failed to refresh: " <> error.message)
        end


      if connected?(socket) do
        # very unlikely that this will be needed one day, but throttling
        # based on last time fetched might help with back pressure
        Process.send_after(self(), :refresh, refresh_interval)
      end
      log(:debug, "Finished handle_info")
      {:noreply, socket}
    end
  end


  @impl true
  def handle_info(_, socket) do
    {:noreply, socket}
  end

  defp vespa_cluster_load(config_host) do
    try do
      {:ok, ClusterLoader.load(config_host)}
    rescue
      e in RuntimeError ->
        IO.inspect(e)
        {:error, e}
    end
  end

  defp assign_refresh_changeset(%{assigns: %{refresh: refresh}} = socket) do
    socket
    |> assign(:changeset, RefreshInterval.change_refresh_rate(refresh))
  end

  @impl true
  def render(assigns) do
    ~L"""
    """
  end
end
