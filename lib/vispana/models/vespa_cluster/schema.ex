defmodule Vispana.Cluster.Schema do
  @enforce_keys [:schemaName, :docCount]
  defstruct [:schemaName, :docCount]
end
