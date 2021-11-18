defmodule Vispana.Cluster.ContainerNode do
  @enforce_keys [:vespaId, :host]
  defstruct [:vespaId, :host, :status_services, :cpu_usage, :disk_usage, :memory_usage]
end
