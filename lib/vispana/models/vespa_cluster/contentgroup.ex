defmodule Vispana.Cluster.ContentGroup do
  @enforce_keys [:key]
  defstruct [:key, :name, contentNodes: []]
end
