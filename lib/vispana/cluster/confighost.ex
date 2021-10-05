defmodule Vispana.Cluster.Backend.ConfigHost do
  defstruct [:url]
  @types %{url: :string}

  import Ecto.Changeset

  def changeset(reference_config_host, attrs) do
    {reference_config_host, @types}
    |> cast(attrs, Map.keys(@types))
    |> validate_required([:url], message: "URL must not be empty")
    |> validate_format(:url, ~r/^(http|https):\/\/[^\s]+$/,
      message: "Host must have protocol (e.g., http:// or https://) and no spaces"
    )
  end
end
