package com.vispana.api.model.content;

import com.vispana.api.model.Host;
import com.vispana.api.model.HostMetrics;
import com.vispana.api.model.Status;

import java.util.Map;

public record ContentNode(String name, Host host, Map<String, Status> processesStatus, HostMetrics hostMetrics, Group group) {}
