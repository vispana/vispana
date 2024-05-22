Sample app setup
=============================

Vispana assume that a application is running with name `default`.
This project include a sample application that can be deployed to vespa (in docker).

## Pre-requisites
To deploy and feed the app one can use the vespa cli.
It can be installed with `brew install vespa-cli`

## Setup

1. Have vespa running in docker.

2. Setup vespa-cli to point to the vespa container (localhost:8080)
```shell
vespa config set target local
```

3. Deploy the sample app
```shell
vespa deploy --wait 300 sample-app
```

3. Feed sample data into the app
```shell
vespa feed sample-app/sampledata/vespa_msmarco.json
```
