FROM elixir:1.12.2
EXPOSE 4000

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt update
RUN apt install -y git nodejs inotify-tools
RUN apt install -y chromium-driver

RUN mkdir -p /app
WORKDIR /app

RUN mix local.hex --force && \
  mix local.rebar --force && \
  mix archive.install --force hex phx_new

COPY mix.exs .
COPY mix.lock .

# copy the deps in dev environment for faster builds
COPY deps ./deps
RUN ["mix", "deps.get"]
RUN ["mix", "deps.compile"]

COPY assets ./assets
WORKDIR /app/assets
RUN ["npm", "rebuild", "node-sass"]
RUN ["npm", "install"]

WORKDIR /app

COPY config ./config
COPY lib ./lib
#COPY seeds ./seeds
COPY priv ./priv
COPY test ./test
#COPY dev/support ./dev/support

RUN ["mix", "compile"]

# compile deps in test environment for faster test runs when built
RUN export MIX_ENV=test && mix deps.compile

#COPY ./run.sh ./run.sh
CMD ["mix", "phx.server"]
