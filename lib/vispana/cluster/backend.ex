defmodule Vispana.Cluster.Backend do
  alias Vispana.Cluster.Backend.ConfigHost

  def change_backend(%ConfigHost{} = config_host, attrs \\ %{}) do
    ConfigHost.changeset(config_host, attrs)
  end
end
