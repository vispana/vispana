defmodule Vispana.Cluster.AppPackage do
  defstruct [:generation, :vespaVersion, :schemas, :hosts, :services, :viewContent]
end
