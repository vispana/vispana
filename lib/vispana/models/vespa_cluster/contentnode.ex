defmodule Vispana.Cluster.ContentNode do
  @enforce_keys [:vespaId, :distributionKey, :host, :metrics]
  defstruct [:vespaId, :distributionKey, :host, :metrics]
end
