package com.vispana.vespa.state.helpers;

import static com.vispana.vespa.state.helpers.Request.requestGet;

import com.vispana.client.vespa.model.MetricsNode;
import com.vispana.client.vespa.model.MetricsSchema;
import java.util.Map;
import java.util.stream.Collectors;

public class MetricsFetcher {
  public static Map<String, MetricsNode> fetchMetrics(String configHost) {
    var metricsUrl = configHost + "metrics/v2/values";
    return requestGet(metricsUrl, MetricsSchema.class).getNodes().stream()
        .map(metricsNode -> Map.entry(metricsNode.getHostname(), metricsNode))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }
}
