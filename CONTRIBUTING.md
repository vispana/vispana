Contributing to Vispana
=============================

Vispana is developed using [Java](https://www.java.com/) and [React](https://react.dev/).

You can contribute to Vispana through code, documentation or bug reports.

## Bug reports

For bug reports, make sure you:
- Give enough details regarding your setup
- Include versions for Vespa and Vispana
- Describe steps to reproduce the error, the error itself and expected behaviour

## Prerequisites

If you're new to Java and React development, you'll need to set up your system.

More specifically, Vispana requires Java 21 to run. 

1. Install [Java 21 or newer](https://www.oracle.com/se/java/technologies/downloads/#java21).
   * Consider using [SDKMAN](https://sdkman.io/)! to manage all your java versions.
2. You may not need to install NodeJS directly in your machine since the build process in maven 
   should allow you to run the application. However, if you want to run commands such as `npm run 
   watch` you can install NodeJS [from here](https://nodejs.org/en/download/).
    * Consider using a version manager like [nvm](https://github.com/nvm-sh/nvm).

## Local Development

**NOTE**: If you run locally, in your preferred IDE, make sure to enable the Preview features from 
Java 21.

To run locally, execute:

```shell
<vispana-root-folder> ./start.sh
```

The service will be available at [`localhost:4000`](http://localhost:4000) from your browser.

## Image Publishing

Upon merges to master, Vispana will automatically generate a new image in Docker hub.
