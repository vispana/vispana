defmodule Vispana.Cluster.Node do
  use Ecto.Schema

  schema "nodes" do
    field :content, :map
    field :hostname, :string
    field :serviceTypes, {:array, :string}

    timestamps()
  end
end
