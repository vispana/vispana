defmodule VispanaWeb.ConfigHostLive.Index do
  use VispanaWeb, :live_view

  alias Vispana.Cluster.ReferenceConfigHost

  @impl true
  @spec mount(any, any, Phoenix.LiveView.Socket.t()) :: {:ok, Phoenix.LiveView.Socket.t()}
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :config_host, "")}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div class="hero min-h-screen bg-darkest-blue">
      <div class="flex-col justify-center hero-content lg:flex-row w-full">

        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-standout-blue overflow-visible">
          <div style="position:absolute; top:-50px; left:calc(50% - 40px);" class="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
            <div class="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400">
              <img defer phx-track-static src='<%= Routes.static_path(@socket, "/img/icons8-hive-64.png") %>' class="icon icon-tabler icon-tabler-stack">
            </div>
          </div>
          <div class="mt-10 card-body w-800 ">
            <form method="get" action="<%= Routes.node_index_path(@socket, :index) %>" >
              <div class="form-control">
                <input type="text" placeholder="e.g.: http://localhost:19071" class="input text-center input-bordered" name="config_host">
              <div class="form-control mt-6">
                <input type="submit" value="Connect" class="btn">
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    """
    # <h1>Config Host</h1>


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
