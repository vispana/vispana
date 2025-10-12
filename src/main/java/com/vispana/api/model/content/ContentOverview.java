package com.vispana.api.model.content;

import java.util.Map;

public record ContentOverview(
    int partitionGroups,
    int searchableCopies,
    int redundancy,
    int notYetConverged,
    Map<GroupKey, Integer> groupNodeCount) {}
