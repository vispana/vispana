defmodule VispanaWeb.NodeLive.Index do
  use VispanaWeb, :live_view

  alias Vispana.Cluster

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :nodes, list_nodes())}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Nodes")
    |> assign(:node, nil)
  end

  defp list_nodes do
    Cluster.list_nodes()
  end
end