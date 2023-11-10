package com.vispana.client.vespa.assemblers;

import static com.vispana.client.vespa.helpers.ProcessStatus.processStatus;
import static com.vispana.client.vespa.helpers.Request.request;
import static com.vispana.client.vespa.helpers.SystemMetrics.systemMetrics;

import com.vispana.api.model.Host;
import com.vispana.api.model.container.ContainerCluster;
import com.vispana.api.model.container.ContainerNode;
import com.vispana.api.model.container.ContainerNodes;
import com.vispana.client.vespa.helpers.NameExtractorFromUrl;
import com.vispana.client.vespa.model.ClusterInfoSchema;
import com.vispana.client.vespa.model.ContainerComponentsSchema;
import com.vispana.client.vespa.model.ContainerSchema;
import com.vispana.client.vespa.model.MetricsNode;
import java.util.Map;

public class ContainerAssembler {

  public static ContainerNodes assemble(String configHost, Map<String, MetricsNode> vespaMetrics) {
    var clusterInfoUrl = configHost + "/config/v1/cloud.config.cluster-info/";
    var containers =
        request(clusterInfoUrl, ClusterInfoSchema.class).getConfigs().stream()
            .map(NameExtractorFromUrl::nameFromUrl)
            .filter(clusterName -> !"admin".equals(clusterName)) // always remove admin entry
            .map(
                clusterName -> {
                  var url = configHost + "/config/v1/cloud.config.cluster-info/" + clusterName;
                  return request(url, ContainerSchema.class);
                })
            .toList();

    var containerNodes =
        containers.stream()
            .map(containerSchema -> containerCluster(configHost, vespaMetrics, containerSchema))
            .toList();

    return new ContainerNodes(containerNodes);
  }

  private static ContainerCluster containerCluster(
      String configHost, Map<String, MetricsNode> vespaMetrics, ContainerSchema containerSchema) {
    var nodesInCluster =
        containerSchema.getServices().stream()
            .map(
                service -> {
                  var hostname = service.getHostname();
                  var queryPort =
                      service.getPorts().stream()
                          .filter(port -> port.getTags().contains("query"))
                          .map(port -> port.getNumber())
                          .findFirst()
                          .orElse(-1L);
                  var processStatus = processStatus(hostname, vespaMetrics);
                  var systemMetrics = systemMetrics(vespaMetrics.get(hostname));
                  return new ContainerNode(
                      service.getIndex().toString(),
                      new Host(hostname, queryPort.intValue()),
                      processStatus,
                      systemMetrics);
                })
            .toList();
    var clusterId = containerSchema.getClusterId();
    var containerType = fetchContainerType(configHost, clusterId);

    var canIndex = containerType.canIndex();
    var canSearch = containerType.canSearch();

    return new ContainerCluster(clusterId, nodesInCluster, canIndex, canSearch);
  }

  private static ContainerType fetchContainerType(String configHost, String clusterName) {
    var url = configHost + "config/v1/container.components/" + clusterName;
    var containerComponents = request(url, ContainerComponentsSchema.class);

    var canIndex =
        containerComponents.getComponents().stream()
            .anyMatch(
                component ->
                    component.getClassId().equals("com.yahoo.docprocs.indexing.IndexingProcessor"));

    var canSearch =
        containerComponents.getComponents().stream()
            .anyMatch(
                component ->
                    component.getClassId().equals("com.yahoo.prelude.cluster.ClusterSearcher"));
    return ContainerType.from(canIndex, canSearch);
  }

  enum ContainerType {
    NONE,
    INDEX,
    SEARCH,
    BOTH;

    static ContainerType from(boolean canIndex, boolean canSearch) {
      if (canIndex && canSearch) {
        return BOTH;
      }
      if (canIndex) {
        return INDEX;
      }
      if (canSearch) {
        return SEARCH;
      }
      return NONE;
    }

    boolean canSearch() {
      return this == SEARCH || this == BOTH;
    }

    boolean canIndex() {
      return this == INDEX || this == BOTH;
    }
  }
}
