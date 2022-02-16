Contributing to Vispana
=============================

You can contribute to Vispana through code, documentation or bug reports.

## Bug reports

For bug reports, make sure you:
- Give enough details regarding your setup
- Include versions for Vespa and Vispana
- Describe steps to reproduce the error, the error itself and expected behaviour

## Development

Vispana is developed using [Elixir](https://elixir-lang.org/) and the [Phoenix framework](https://www.phoenixframework.org/).

It is also necessary to have Node.js.

To run locally, execute:

```shell
<vispana-root-folder> ./start.sh
```

The service will be available at [`localhost:4000`](http://localhost:4000) from your browser.

## Image publishing

Since Vispana is still in its early days and it lacks tests to ensure that the builds are not broken, the process of building and publishing Docker images
are done manually, in an ad-hoc basis.
