package com.vispana.model.content;

import java.util.List;

public record ContentCluster(String name, ContentOverview overview, List<ContentStoredData> storedData, List<ContentNode> nodes) {}
