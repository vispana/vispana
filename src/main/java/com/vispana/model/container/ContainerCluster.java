package com.vispana.model.container;

import java.util.List;

public record ContainerCluster(String name, List<ContainerNode> nodes) {}
