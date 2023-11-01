package com.vispana.api.model.content;

import java.util.List;

public record ContentCluster(String name, ContentOverview overview, List<ContentData> contentData, List<ContentNode> nodes) {}
