defmodule Vispana.Cluster.Schema do
  @enforce_keys [:schemaName, :schemaPayload]
  defstruct [:schemaName, :schemaPayload]
end
