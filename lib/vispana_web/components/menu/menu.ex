defmodule VispanaWeb.Menu do
  use VispanaWeb, :live_component

  @impl true
  def render(assigns) do
    ~L"""
    <div id="sideBar" class="relative h-screen  flex flex-col flex-wrap p-6 flex-none w-64 md:-ml-64 md:fixed md:top-0 md:z-30 md:h-screen md:shadow-xl animated faster bg-standout-blue">
      <div class="flex flex-col" >
        <div class="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
          <div class="mb-3 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer text-indigo-700 border-2 border-yellow-400">
            <img defer phx-track-static src='<%= Routes.static_path(@socket, "/img/icons8-hive-64.png") %>' class="icon icon-tabler icon-tabler-stack">
          </div>
        </div>

        <p class="uppercase text-xs text-gray-100 mb-4 tracking-wider">Cluster</p>

        <a href="/nodes?config_host=<%= @config_host %>" class="mb-3 capitalize font-medium text-sm hover:text-white text-yellow-400 transition ease-in-out duration-500">
          <i class="fas fa-server text-xs mr-2"></i>
          Nodes
        </a>

        <a href="#config_host=<%= @config_host %>" class="mb-3 capitalize font-medium text-sm hover:text-white text-yellow-400 transition ease-in-out duration-500">
          <i class="fas fa-archive text-xs mr-2"></i>
          Application packages
        </a>

        <a href="#config_host=<%= @config_host %>" class="mb-3 capitalize font-medium text-sm hover:text-white text-yellow-400 transition ease-in-out duration-500">
          <i class="fab fa-searchengin text-xs mr-2"></i>
          Query
        </a>

        <a href="#config_host=<%= @config_host %>" class="mb-3 capitalize font-medium text-sm hover:text-white text-yellow-400 transition ease-in-out duration-500">
          <i class="fas fa-database text-xs mr-2"></i>
          Sample data
        </a>

        <a href="#" class="mb-3 capitalize font-medium text-sm hover:text-white text-yellow-400 transition ease-in-out duration-500">
          <i class="fas fa-info-circle text-xs mr-2"></i>
          About
        </a>
      </div>
    </div>
    """
  end
end
