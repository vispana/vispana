defmodule Vispana.Cluster.Node do
  use Ecto.Schema
  import Ecto.Changeset

  schema "nodes" do
    field :content, :map
    field :hostname, :string
    field :serviceTypes, {:array, :string}

    timestamps()
  end

  @doc false
  def changeset(node, attrs) do
    node
    |> cast(attrs, [:hostname, :serviceTypes, :content])
    |> validate_required([:hostname, :serviceTypes])
  end
end
