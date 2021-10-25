defmodule VispanaWeb.Copyright do
  use VispanaWeb, :live_component

  import Logger, warn: false

  @impl true
  def render(assigns) do
    ~L"""
    <div class="flex-1 p-6 md:mt-16">
      <div class="flex flex-grow flex-col pt-2 normal-case">
        <div class="-my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto text-center text-xs text-gray-400">
          <p>© 2021 — MIT License</p>
          <p><a href="https://icons8.com/icon/65460/hive">Hive icon by Icons8</a></p>
        </div>
      </div>
    </div>
    """
  end
end
