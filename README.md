# Vispana

Vispana is a [Vespa.ai](https://vespa.ai/) web client tool designed to quickly understand the status of a cluster.

![Vispana](src/main/resources/static/img/vispana-ss.png)

#### Contents

1. [Quickstart](#quickstart)
2. [Running Locally](#running-locally)
3. [Contributing](#contributing)
4. [Known Limitations](#known-limitations)

---

## Quickstart

Vispana is packaged in docker and available in [DockerHub](https://hub.docker.com/r/vispana/vispana).

To run, execute:
```shell
docker run -p 4000:4000 vispana/vispana
```

Access on: [http://localhost:4000](http://localhost:4000)

It will ask for the uri of a config-server in your cluster.

## Running Locally

Set up your system using the [prerequisites](https://github.com/vispana/vispana/blob/main/CONTRIBUTING.md#prerequisites) section of `CONTRIBUTING.md`.

Then run the start script!

```shell
./start.sh
```

If you don't want to use the script, you can always run the commands yourself.

```shell
mix deps.get
npm install --prefix ./assets
mix phx.server
```

## Contributing

We welcome your contributions through code, documentation, and bug reports!

Please see our [guidelines](./CONTRIBUTING.md) on how you can help.

## Known Limitations

- Accessing Vespa APIs with authentication is unsupported (i.e., Vespa Cloud is likely to not work).
