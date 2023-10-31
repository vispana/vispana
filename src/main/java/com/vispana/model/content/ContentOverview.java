package com.vispana.model.content;

import java.util.Map;

public record ContentOverview(int partitionGroups, int searchableCopies, int redundancy, Map<GroupKey, Integer> groupNodeCount) {
}
