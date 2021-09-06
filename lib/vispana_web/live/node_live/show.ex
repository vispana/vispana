defmodule VispanaWeb.NodeLive.Show do
  use VispanaWeb, :live_view

  alias Vispana.Cluster

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _, socket) do
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:node, Cluster.get_node!(id))}
  end

  defp page_title(:show), do: "Show Node"
  defp page_title(:edit), do: "Edit Node"
end
