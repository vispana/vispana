package com.vispana.vespa.state.helpers;

import com.vispana.api.model.Status;
import com.vispana.client.vespa.model.MetricsNode;
import java.util.Map;
import java.util.stream.Collectors;

public class ProcessStatus {
  public static Map<String, Status> processStatus(
      String host, Map<String, MetricsNode> vespaMetrics) {
    return vespaMetrics.get(host).getServices().stream()
        .map(
            service -> {
              var serviceName = service.getName();
              var status = Status.parseFrom(service.getStatus().getCode());
              return Map.entry(serviceName, status);
            })
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }
}
