defmodule VispanaWeb.ConfigLive.Index do
  import Logger, warn: false

  use VispanaWeb, :live_view

  alias VispanaWeb.VispanaCommon

  @impl true
  def mount(params, session, socket) do
    VispanaCommon.mount(params, session, socket)
  end

  @impl true
  def handle_params(params, url, socket) do
    VispanaCommon.handle_params(params, url, socket)
  end

  @impl true
  def handle_event("refresh", value, socket) do
    VispanaCommon.handle_event("refresh", value, socket)
  end

  @impl true
  def handle_event( "refresh_interval", %{"refresh_interval" => refresh_params}, socket) do
    VispanaCommon.handle_event("refresh_interval", %{"refresh_interval" => refresh_params}, socket)
  end

  @impl true
  def handle_info(:refresh, socket) do
    VispanaCommon.handle_info(:refresh, socket)
  end


  @impl true
  def handle_info(_, socket) do
    {:noreply, socket}
  end
end
