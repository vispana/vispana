defmodule Vispana.Cluster.AppPackage do
  defstruct [:buildTimestamp, :generation, :vespaVersion, :schemas, :hosts, :services, :viewContent]
end
