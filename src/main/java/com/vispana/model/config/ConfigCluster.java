package com.vispana.model.config;

import java.util.List;

public record ConfigCluster(String name, List<ConfigNode> nodes) {}
