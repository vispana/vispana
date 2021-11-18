defmodule Vispana.Cluster.VespaCluster do
  defstruct [:configCluster, :containerClusters, :contentClusters]

  alias Vispana.Cluster.VespaCluster
  alias Vispana.Cluster.ConfigCluster

  def empty_cluster do
    %VespaCluster{
      configCluster: %ConfigCluster{},
      containerClusters: [],
      contentClusters: []
    }
  end
end
