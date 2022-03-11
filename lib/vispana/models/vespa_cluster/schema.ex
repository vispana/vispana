defmodule Vispana.Cluster.Schema do
  @enforce_keys [:schemaName, :docCountByGroup]
  defstruct [:schemaName, :docCountByGroup]
end
