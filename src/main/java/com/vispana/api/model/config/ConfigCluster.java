package com.vispana.api.model.config;

import java.util.List;

public record ConfigCluster(String name, List<ConfigNode> nodes) {}
