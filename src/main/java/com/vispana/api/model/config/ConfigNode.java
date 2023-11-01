package com.vispana.api.model.config;

import com.vispana.api.model.Host;
import com.vispana.api.model.HostMetrics;
import com.vispana.api.model.Status;

import java.util.Map;

public record ConfigNode(String name, Host host, Map<String, Status> processesStatus, HostMetrics hostMetrics) {}
