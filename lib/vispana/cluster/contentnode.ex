defmodule Vispana.Cluster.ContentNode do
  @enforce_keys [:vespaId, :distributionKey, :host]
  defstruct [:vespaId, :distributionKey, :host]
end
