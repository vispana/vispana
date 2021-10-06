defmodule Vispana.Cluster.VespaCluster do
  defstruct [:configCluster, :containerCluster, :contentClusters]

  alias Vispana.Cluster.VespaCluster
  alias Vispana.Cluster.ConfigCluster
  alias Vispana.Cluster.ContainerCluster

  def empty_cluster do
    %VespaCluster{configCluster: %ConfigCluster{}, containerCluster: %ContainerCluster{}, contentClusters: []}
  end
end
