defmodule Vispana.Cluster.ConfigNode do
  @enforce_keys [:vespaId, :host]
  defstruct [:vespaId, :host]
end
