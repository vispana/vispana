# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :vispana,
  ecto_repos: [Vispana.Repo]

# Configures the endpoint
config :vispana, VispanaWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "4xFNZKbJOuaekri53Y3JXhenmtMLHb2q+gpdbL2JjYczNSOJOqi+bqiyZ68f9+t1",
  render_errors: [view: VispanaWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Vispana.PubSub,
  live_view: [signing_salt: "O6HI15PI"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
