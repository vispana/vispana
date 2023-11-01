package com.vispana.api.model.content;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ContentData(Schema schema, List<SchemaDocCount> schemaDocCountPerGroup) {

    @JsonProperty
    public long maxDocPerGroup() {
        return schemaDocCountPerGroup().stream().map(SchemaDocCount::documents).max(Long::compare).orElse(0L);
    }
}
