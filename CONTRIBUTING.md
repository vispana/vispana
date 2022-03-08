Contributing to Vispana
=============================

Vispana is developed using [Elixir](https://elixir-lang.org/) and the [Phoenix framework](https://www.phoenixframework.org/).

You can contribute to Vispana through code, documentation or bug reports.

## Bug reports

For bug reports, make sure you:
- Give enough details regarding your setup
- Include versions for Vespa and Vispana
- Describe steps to reproduce the error, the error itself and expected behaviour

## Prerequisites

If you're new to Elixir, you'll need to set up your system.

1. Install [Elixir](https://elixir-lang.org/install.html).
   * **Note**: Official instructions may not work for recent **Ubuntu/Debian** distro releases.
   * Debian/PopOS/Ubuntu developers can use [asdf](https://thinkingelixir.com/install-elixir-using-asdf/) instead.
2. Install [NodeJS](https://nodejs.org/en/download/).
   * Consider using a version manage like [nvm](https://github.com/nvm-sh/nvm).
3. *Optional*: IntelliJ IDEA users may want to install the [Erlang](https://plugins.jetbrains.com/plugin/7083-erlang) and [Elixir](https://plugins.jetbrains.com/plugin/7522-elixir) plugins.

## Local Development

If you just installed Elixir and Node, close and reopen your terminal.

To run locally, execute:

```shell
<vispana-root-folder> ./start.sh
```

The service will be available at [`localhost:4000`](http://localhost:4000) from your browser.

## Image Publishing

Since Vispana is still in its early days and it lacks tests to ensure that the builds are not broken, the process of building and publishing Docker images
are done manually, in an ad-hoc basis.
