package com.vispana.model.content;

import com.vispana.model.Host;
import com.vispana.model.HostMetrics;
import com.vispana.model.Status;

import java.util.Map;

public record ContentNode(String name, Host host, Map<String, Status> processesStatus, HostMetrics hostMetrics, Group group) {}
