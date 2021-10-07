defmodule Vispana.Cluster.ContentCluster do
  @enforce_keys [:clusterId, :partitions, :redundancy, :searchableCopies, :node_count]
  defstruct [
    :clusterId,
    :partitions,
    :redundancy,
    :searchableCopies,
    :node_count,
    schemas: [],
    contentGroups: []
  ]
end
