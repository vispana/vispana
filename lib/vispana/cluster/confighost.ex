defmodule Vispana.Cluster.ConfigHost do
  use Ecto.Schema

  schema "confighost" do
    field :url, :string
  end
end
