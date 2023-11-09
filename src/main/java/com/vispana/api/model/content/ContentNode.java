package com.vispana.api.model.content;

import com.vispana.api.model.Host;
import com.vispana.api.model.HostMetrics;
import com.vispana.api.model.Status;
import com.vispana.client.vespa.model.MetricsNode;
import java.util.Map;

public record ContentNode(
    String name,
    Host host,
    Map<String, Status> processesStatus,
    HostMetrics hostMetrics,
    Group group,
    // TODO: make sure how to remove this from the API
    MetricsNode otherMetrics) {}
