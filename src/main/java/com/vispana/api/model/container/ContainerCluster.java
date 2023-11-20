package com.vispana.api.model.container;

import java.util.List;

public record ContainerCluster(
    String name, List<ContainerNode> nodes, boolean canIndex, boolean canSearch) {}
