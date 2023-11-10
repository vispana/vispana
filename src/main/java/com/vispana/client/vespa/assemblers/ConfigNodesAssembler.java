package com.vispana.client.vespa.assemblers;

import static com.vispana.client.vespa.helpers.ProcessStatus.processStatus;
import static com.vispana.client.vespa.helpers.Request.request;
import static com.vispana.client.vespa.helpers.SystemMetrics.systemMetrics;

import com.vispana.api.model.Host;
import com.vispana.api.model.config.ConfigCluster;
import com.vispana.api.model.config.ConfigNode;
import com.vispana.api.model.config.ConfigNodes;
import com.vispana.client.vespa.model.ClusterControllersSchema;
import com.vispana.client.vespa.model.MetricsNode;
import java.util.List;
import java.util.Map;

public class ConfigNodesAssembler {
  public static ConfigNodes assemble(String configHost, Map<String, MetricsNode> vespaMetrics) {

    var clusterControllerUrl =
        configHost + "/config/v1/cloud.config.cluster-info/admin/cluster-controllers";

    var clusterControllers = request(clusterControllerUrl, ClusterControllersSchema.class);
    var configNodes =
        clusterControllers.getServices().stream()
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
                  return new ConfigNode(
                      service.getIndex().toString(),
                      new Host(hostname, queryPort.intValue()),
                      processStatus,
                      systemMetrics);
                })
            .toList();

    var configCluster = new ConfigCluster(clusterControllers.getClusterId(), configNodes);
    return new ConfigNodes(List.of(configCluster));
  }
}
