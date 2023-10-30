package com.vispana.model;

import java.util.Map;

// Configuration Node
public record ConfigurationNodes(Map<String, ConfigurationCluster> configurationNodes) {}
