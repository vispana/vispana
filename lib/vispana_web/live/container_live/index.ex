defmodule VispanaWeb.ContainerLive.Index do
  import Logger, warn: false
  use VispanaWeb, :live_view

  @impl true
  def render(assigns) do
    ~L"""
    """
  end

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Vispana")
  end
end
