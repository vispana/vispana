defmodule Vispana.Cluster.ContainerCluster do
  @enforce_keys [:clusterId]
  defstruct [:clusterId, containerNodes: []]
end
