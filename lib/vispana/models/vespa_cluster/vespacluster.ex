defmodule Vispana.Cluster.VespaCluster do
  defstruct [:configCluster, :containerCluster, :contentClusters]

  alias Vispana.Cluster.VespaCluster
  alias Vispana.Cluster.ConfigCluster

  def empty_cluster do
    %VespaCluster{
      configCluster: %ConfigCluster{},
      containerCluster: [],
      contentClusters: []
    }
  end
end
