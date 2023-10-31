package com.vispana.model;

import java.util.Map;

public record ContainerNode(String name, Host host, Map<String, Status> processesStatus, HostMetrics hostMetrics) {}
