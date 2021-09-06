defmodule Vispana.Repo do
  use Ecto.Repo,
    otp_app: :vispana,
    adapter: Ecto.Adapters.Postgres
end
