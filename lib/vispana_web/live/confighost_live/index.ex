defmodule VispanaWeb.ConfigHostLive.Index do
  use VispanaWeb, :live_view

  alias Vispana.Cluster.ReferenceConfigHost

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :config_host, "")}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Vispana")
    |> assign(:config_host, %ReferenceConfigHost{url: ""})
  end


end
