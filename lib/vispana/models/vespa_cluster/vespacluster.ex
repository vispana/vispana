defmodule Vispana.Cluster.VespaCluster do


  defstruct [:configCluster, :containerClusters, :contentClusters, :appPackage]

  alias Vispana.Cluster.AppPackage
  alias Vispana.Cluster.VespaCluster
  alias Vispana.Cluster.ConfigCluster

  def empty_cluster do
    %VespaCluster{
      configCluster: %ConfigCluster{},
      containerClusters: [],
      contentClusters: [],
      appPackage: %AppPackage{}
    }
  end
end
