package com.vispana.vespa.state.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vispana.client.vespa.model.ConfigModelSchema;
import com.vispana.client.vespa.model.content.Node;
import java.io.File;
import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class VespaConfigModelFetcherTest {

  @BeforeAll
  public static void init() {
    mockStatic(Request.class);
  }

  @Test
  void fetchContentNodes() {
    // Arrange
    String configHost = "http://localhost:8080";

    ConfigModelSchema mockSchema = defaultSchema();
    when(Request.requestGet(any(String.class), any())).thenReturn(mockSchema);

    // Act
    List<Node> result = VespaConfigModelFetcher.fetchContentNodes(configHost);

    // Assert
    assertEquals(1, result.size());
    assertEquals("vespa-content-0-1.vespa", result.get(0).getHost());
    assertEquals(0L, result.get(0).getGroup());
    assertEquals(1L, result.get(0).getKey());
    assertEquals(19103L, result.get(0).getPort());
  }

  private static ConfigModelSchema defaultSchema() {
    ObjectMapper objectMapper = new ObjectMapper();
    ConfigModelSchema configModelSchema = null;
    try {
      ClassLoader loader = VespaConfigModelFetcherTest.class.getClassLoader();
      File file = new File(loader.getResource("json/data/config-model.json").getFile());
      configModelSchema = objectMapper.readValue(file, ConfigModelSchema.class);
    } catch (IOException e) {
      e.printStackTrace();
    }
    return configModelSchema;
  }
}
