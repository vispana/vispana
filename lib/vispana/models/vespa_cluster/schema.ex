defmodule Vispana.Cluster.Schema do
  @enforce_keys [:schemaName, :docCount, :docCountByGroup]
  defstruct [:schemaName, :docCount, :docCountByGroup]
end
