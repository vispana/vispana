defmodule Vispana.Cluster.ContentCluster do
  @enforce_keys [:clusterId, :partitions, :redundancy, :searchableCopies]
  defstruct [:clusterId, :partitions, :redundancy, :searchableCopies, schemas: [], contentGroups: []]
end
