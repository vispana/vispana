package com.vispana.model.config;

import com.vispana.model.Host;
import com.vispana.model.HostMetrics;
import com.vispana.model.Status;

import java.util.Map;

public record ConfigNode(String name, Host host, Map<String, Status> processesStatus, HostMetrics hostMetrics) {}
