defmodule Vispana.Repo.Migrations.CreateNodes do
  use Ecto.Migration

  def change do
    create table(:nodes) do
      add :hostname, :string
      add :serviceTypes, {:array, :string}
      add :content, :map

      timestamps()
    end

  end
end
