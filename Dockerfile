FROM elixir:1.12

# Container setup. Docker caches a layer for each RUN statement.
RUN mkdir -p /app/assets  # The directory structure we will need to run the app.
# The Node install script runs `apt-get update` for us.
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && apt install -y nodejs
# Check that we have NPM.
RUN npm --version
# Get the rest of our container-level dependencies.
RUN apt install -y git nodejs inotify-tools chromium-driver
# Install local mix/Elixir application dependencies.
RUN mix local.hex --force && \
  mix local.rebar --force && \
  mix archive.install --force hex phx_new

# Uses the `.dockerignore` file to exclude certain files and directories.
COPY . /app

# Get and compile deps first - NPM needs `deps/phoenix/package.json`.
WORKDIR /app
RUN mix deps.get
RUN mix deps.compile

# Build our web UI.
WORKDIR /app/assets
RUN npm rebuild node-sass
RUN npm install

# Compile our Elixir application.
WORKDIR /app
RUN mix compile

# Expose the proper port and run the server!
EXPOSE 4000
CMD ["mix", "phx.server"]
