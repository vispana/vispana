defmodule Vispana.Cluster.ConfigNode do
  @enforce_keys [:vespaId, :host]
  defstruct [:vespaId, :host, :status_services, :cpu_usage, :disk_usage, :memory_usage]
end
