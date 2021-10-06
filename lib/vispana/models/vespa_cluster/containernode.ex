defmodule Vispana.Cluster.ContainerNode do
  @enforce_keys [:vespaId, :host]
  defstruct [:vespaId, :host]
end
