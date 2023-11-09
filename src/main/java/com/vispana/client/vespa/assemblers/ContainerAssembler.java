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
            .map(containerSchema -> containerCluster(vespaMetrics, containerSchema))
            .toList();

    return new ContainerNodes(containerNodes);
  }

  private static ContainerCluster containerCluster(
      Map<String, MetricsNode> vespaMetrics, ContainerSchema containerSchema) {
    var nodesInCluster =
        containerSchema.getServices().stream()
            .map(
                service -> {
                  var hostname = service.getHostname();
                  var processStatus = processStatus(hostname, vespaMetrics);
                  var systemMetrics = systemMetrics(vespaMetrics.get(hostname));
                  return new ContainerNode(
                      service.getIndex().toString(),
                      new Host(hostname, -1),
                      processStatus,
                      systemMetrics);
                })
            .toList();
    return new ContainerCluster(containerSchema.getClusterId(), nodesInCluster);
  }
}
