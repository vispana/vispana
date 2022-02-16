# Vispana

Vispana is a [Vespa.ai](https://vespa.ai/) web client tool designed to quickly understand the status of a cluster.

![Vispana](/assets/static/img/vispana-ss.png)


## How to run

Vispana is packaged in docker and available in [DockerHub](https://hub.docker.com/r/vispana/vispana)

To run, execute:
```shell
docker run -p 4000:4000 vispana/vispana
```

Access on: http://localhost:4000

It will ask for the uri of a config-server in your cluster.

## Known limitations

- Accessing Vespa API's with authentication is unsupported (i.e., Vespa Cloud is likely to not work)