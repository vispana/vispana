defmodule Vispana.Cluster.ContentGroup do
  @enforce_keys [:key]
  defstruct [:key, contentNodes: []]
end
