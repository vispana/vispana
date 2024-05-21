package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;

public class Content {

  @JacksonXmlProperty(isAttribute = true)
  private String id;

  @JacksonXmlProperty(localName = "group")
  private Group group;

  @JacksonXmlProperty(localName = "nodes")
  Nodes nodes;

  public List<Group> getGroups() {
    return group != null ? group.getGroups() : List.of();
  }

  public List<Node> getNodes() {
    return nodes != null ? nodes.getNodes() : List.of();
  }

  public boolean hasNodes() {
    return nodes != null && nodes.getNodes() != null && !nodes.getNodes().isEmpty();
  }
}
