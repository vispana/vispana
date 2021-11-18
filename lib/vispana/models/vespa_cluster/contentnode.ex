defmodule Vispana.Cluster.ContentNode do
  @enforce_keys [:vespaId, :distributionKey, :host, :metrics]
  defstruct [:vespaId, :distributionKey, :host, :metrics, :status_services, :cpu_usage, :disk_usage, :memory_usage]
end
