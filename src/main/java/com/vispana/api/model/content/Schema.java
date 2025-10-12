package com.vispana.api.model.content;

import java.util.Map;

public record Schema(String schemaName, String schemaContent, Map<String, String> schemaRankProfiles) {}
