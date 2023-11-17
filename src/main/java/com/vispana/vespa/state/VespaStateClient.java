package com.vispana.vespa.state;

import com.vispana.api.model.VispanaRoot;
import com.vispana.vespa.state.assemblers.AppPackageAssembler;
import com.vispana.vespa.state.assemblers.ConfigNodesAssembler;
import com.vispana.vespa.state.assemblers.ContainerAssembler;
import com.vispana.vespa.state.assemblers.ContentAssembler;
import com.vispana.vespa.state.helpers.ApplicationUrlFetcher;
import com.vispana.vespa.state.helpers.MetricsFetcher;
import com.vispana.vespa.state.helpers.VespaVersionFetcher;
import java.util.concurrent.StructuredTaskScope;
import org.springframework.stereotype.Component;

@Component
public class VespaStateClient {
  public VispanaRoot vespaState(String configHost) {

    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
      // fetch prerequisites concurrently and block until tasks are done
      var vespaVersionFork = scope.fork(() -> VespaVersionFetcher.fetch(configHost));
      var vespaMetricsFork = scope.fork(() -> MetricsFetcher.fetchMetrics(configHost));
      var appUrlFork = scope.fork(() -> ApplicationUrlFetcher.fetch(configHost));
      scope
          .join()
          .throwIfFailed(
              throwable ->
                  new RuntimeException("Failed to get prerequisites from Vespa", throwable));
      var vespaMetrics = vespaMetricsFork.get();
      var vespaVersion = vespaVersionFork.get();
      var appUrl = appUrlFork.get();

      // fetch and build Vispana components concurrently and block until tasks are done
      var configFork = scope.fork(() -> ConfigNodesAssembler.assemble(configHost, vespaMetrics));
      var containerFork = scope.fork(() -> ContainerAssembler.assemble(configHost, vespaMetrics));
      var contentFork =
          scope.fork(
              () -> ContentAssembler.assemble(configHost, vespaVersion, vespaMetrics, appUrl));
      var appPackageScope = scope.fork(() -> AppPackageAssembler.assemble(appUrl));
      scope
          .join()
          .throwIfFailed(
              throwable -> new RuntimeException("Failed to get data from Vespa", throwable));

      var configNodes = configFork.get();
      var containerNodes = containerFork.get();
      var contentNodes = contentFork.get();
      var appPackage = appPackageScope.get();

      return new VispanaRoot(configNodes, containerNodes, contentNodes, appPackage);
    } catch (Throwable t) {
      // Since this application is not meant to be exposed outside a perimeter, jut throw
      // the exception to ease debugging
      throw new RuntimeException(t);
    }
  }
}
