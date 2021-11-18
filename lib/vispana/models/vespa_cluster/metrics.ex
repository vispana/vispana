defmodule Vispana.Cluster.Metrics do
  defstruct [:status_services, cpu_usage: 0, memory_usage: 0, disk_usage: 0]
end
