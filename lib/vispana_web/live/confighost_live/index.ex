defmodule VispanaWeb.ConfigHostLive.Index do
  import Logger, warn: false
  use VispanaWeb, :live_view

  alias Vispana.Cluster.Backend.ConfigHost

  @impl true
  def render(assigns) do
    ~L"""
    <div class="hero min-h-screen bg-darkest-blue">
      <div class="flex-col justify-center hero-content lg:flex-row w-full">

        <div class="card flex-shrink-0 w-full max-w-1/2 shadow-2xl bg-standout-blue overflow-visible">
          <div style="position:absolute; top:-50px; left:calc(50% - 40px);" class="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
            <div class="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400">
              <img defer phx-track-static src='<%= Routes.static_path(@socket, "/img/icons8-hive-64.png") %>' class="icon icon-tabler icon-tabler-stack">
            </div>
          </div>
          <div class="flex mt-10 card-body w-800 ">
            <%= f = form_for @changeset, "#",
                id: "form",
                phx_change: "validate",
                phx_submit: "connect" %>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Vespa Configuration URL</span>
                </label>
                <%= text_input f, :url, phx_debounce: "blur", class: "input text-center input-bordered", placeholder: "e.g.: http://localhost:19071" %>
              </div>
              <div class="form-control">
                <%= error_tag f, :url %>
              </div>
              <div class="form-control mt-4">
                <%= submit "Connect", class: "btn btn-ghost" %>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    """
  end

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign_config_host()
     |> assign_changeset()}
  end

  @impl true
  def handle_event(
        "validate",
        %{"config_host" => config_host_params},
        %{assigns: %{config_host: config_host}} = socket
      ) do
    changeset =
      config_host
      |> ConfigHost.change_backend(config_host_params)
      |> Map.put(:action, :validate)

    {:noreply,
     socket
     |> assign(:changeset, changeset)}
  end

  @impl true
  def handle_event(
        "connect",
        %{"config_host" => config_host_params},
        %{assigns: %{changeset: changeset}} = socket
      ) do
    if changeset.valid? do
      {:noreply, socket |> redirect(to: "/content?config_host=" <> config_host_params["url"])}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Vispana")
  end

  defp assign_config_host(socket) do
    socket
    |> assign(:config_host, %ConfigHost{})
  end

  defp assign_changeset(%{assigns: %{config_host: config_host}} = socket) do
    socket
    |> assign(:changeset, ConfigHost.change_backend(config_host))
  end
end
