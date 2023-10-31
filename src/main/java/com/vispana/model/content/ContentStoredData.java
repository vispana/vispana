package com.vispana.model.content;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record ContentStoredData(Schema schema, Map<GroupKey, Long> documentsPerGroup) {

    @JsonProperty
    public long maxDocPerGroup() {
        return documentsPerGroup().values().stream().max(Long::compare).orElse(0L);
    }
}
