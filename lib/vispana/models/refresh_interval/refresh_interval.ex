defmodule Vispana.Cluster.Refresher.RefreshInterval do
  defstruct [:interval]
  @types %{interval: :integer}

  import Ecto.Changeset
  alias Vispana.Cluster.Refresher.RefreshInterval

  def change_refresh_rate(%RefreshInterval{} = refresh_interval, attrs \\ %{}) do
    changeset(refresh_interval, attrs)
  end

  defp changeset(refresh_interval, attrs) do
    {refresh_interval, @types}
    |> cast(attrs, Map.keys(@types))
    |> validate_required([:interval], message: "Interval must be set")
  end
end
