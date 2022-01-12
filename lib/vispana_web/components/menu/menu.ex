defmodule VispanaWeb.Menu do
  use VispanaWeb, :live_component

  import Logger, warn: false

  @impl true
  def mount(socket) do
    view = case socket.view do
      VispanaWeb.ConfigLive.Index -> "config"
      VispanaWeb.ContainerLive.Index -> "container"
      VispanaWeb.ContentLive.Index -> "content"
      VispanaWeb.AppPackageLive.Index -> "apppackage"
      _ -> raise "No views match"
    end
    {:ok, socket |> assign(:view, view)}
  end

  @impl true
  def render(assigns) do
    ~L"""
    <div id="sideBar" class="relative h-screen  flex flex-col flex-wrap p-6 flex-none w-56 md:-ml-64 md:fixed md:top-0 md:z-30 md:h-screen md:shadow-xl animated faster bg-standout-blue">
      <div class="flex flex-col" >
        <div class="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
          <div class="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400">
            <a href="/"><img defer phx-track-static src='<%= Routes.static_path(@socket, "/img/icons8-hive-64.png") %>' class="icon icon-tabler icon-tabler-stack"></a>
          </div>
        </div>

        <a href="/config?config_host=<%= @config_host %>" class='mb-3 capitalize font-medium text-sm hover:text-white transition ease-in-out duration-500 <%= if @view == "config" do "text-yellow-400" else "text-gray-300" end %>'>
          <i class="fas fa-project-diagram text-xs mr-2"></i>
          Config
        </a>

        <a href="/container?config_host=<%= @config_host %>" class='mb-3 capitalize font-medium text-sm hover:text-white  transition ease-in-out duration-500 <%= if @view == "container" do "text-yellow-400" else "text-gray-300" end %>'>
          <i class="fas fa-microchip text-xs mr-2"></i>
          Container
        </a>

        <a href="/content?config_host=<%= @config_host %>" class='mb-3 capitalize font-medium text-sm hover:text-white transition ease-in-out duration-500 <%= if @view == "content" do "text-yellow-400" else "text-gray-300" end %>'>
          <i class="fas fa-hdd text-xs mr-2"></i>
          Content
        </a>

        <a href="/apppackage?config_host=<%= @config_host %>" class='mb-3 capitalize font-medium text-sm hover:text-white transition ease-in-out duration-500 <%= if @view == "apppackage" do "text-yellow-400" else "text-gray-300" end %>'>
          <i class="fas fa-archive text-xs mr-2"></i>
          Application package
        </a>
      </div>
    </div>
    """
  end
end
