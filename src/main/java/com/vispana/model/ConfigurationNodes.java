package com.vispana.model;

import java.util.List;
import java.util.Map;

public record ConfigurationNodes(Map<String, List<ConfigurationNode>> configurationNodes) {}
