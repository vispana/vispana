package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;

public class Group {

  @JacksonXmlProperty(localName = "name", isAttribute = true)
  private String name;

  @JacksonXmlProperty(localName = "distribution-key", isAttribute = true)
  private String distributionKey;

  @JacksonXmlElementWrapper(useWrapping = false)
  @JacksonXmlProperty(localName = "group")
  List<Group> groups;

  public List<Group> getGroups() {
    return groups != null ? groups : List.of(this);
  }

  @JacksonXmlElementWrapper(useWrapping = false)
  @JacksonXmlProperty(localName = "node")
  List<Node> nodes;

  public String getName() {
    return name;
  }

  public String getDistributionKey() {
    return distributionKey != null ? distributionKey : "-1";
  }

  public List<Node> getNodes() {
    return nodes != null ? nodes : List.of();
  }
}
