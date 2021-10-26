# Vispana

Vispana is a Vespa client tool designed to quickly understand the status of a cluster.

## How to run

Vispana is packaged in docker and available in [DockerHub](https://hub.docker.com/r/vispana/vispana)
To run, execute:
```shell
docker run -p 4000:4000 vispana/vispana
```

It will ask for the uri of a config-server in your cluster.

## Setup

Vispana is developed using [Elixir](https://elixir-lang.org/) and the [Phoenix framework](https://www.phoenixframework.org/).

It is also necessary to have Node.js.

To run locally, execute:

```shell
<vispana-root-folder> ./start.sh
```

The service will be available at [`localhost:4000`](http://localhost:4000) from your browser.
