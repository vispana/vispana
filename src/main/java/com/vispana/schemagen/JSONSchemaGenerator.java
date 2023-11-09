package com.vispana.schemagen;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URL;

/**
 * Prints a Schema from a JSON exampl from '/resources/json/data/'. POJOs are automatically
 * generated on build once schema files are placed into /resources/json/schema with extension
 * '.schema.json'
 */
public class JSONSchemaGenerator {
  public static void main(String[] args) throws IOException {
    var jsonMapper = new JSONSchemaGenerator();
    var application = jsonMapper.getResource("application.json");
    jsonMapper.toSchema(application);
  }

  private URL getResource(String filename) {
    return this.getClass().getResource("/json/data/" + filename);
  }

  public void toSchema(URL json) throws IOException {
    var jsonNode = this.objectMapper().readTree(json);
    var schemaGen = new org.jsonschema2pojo.SchemaGenerator();
    var schemaAsJsonNode = schemaGen.schemaFromExample(jsonNode);
    var schema = schemaAsJsonNode.toPrettyString();
    System.out.println(schema);
  }

  private ObjectMapper objectMapper() {
    return new ObjectMapper()
        .enable(JsonParser.Feature.ALLOW_COMMENTS)
        .enable(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS);
  }
}
