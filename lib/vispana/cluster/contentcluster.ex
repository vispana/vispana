defmodule Vispana.Cluster.ContentCluster do
  @enforce_keys [:clusterId, :partitions]
  defstruct [:clusterId, :partitions, schemas: [], contentGroups: []]
end
