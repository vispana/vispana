package com.vispana.model;

import java.util.Map;

public record ConfigurationNode(String name, Host host, Map<String, Status> processesStatus, HostMetrics hostMetrics) {}
