package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.util.List;

@JacksonXmlRootElement(localName = "nodes")
public class Nodes {

  @JacksonXmlElementWrapper(useWrapping = false)
  @JacksonXmlProperty(localName = "node")
  List<Node> nodes;

  protected List<Node> getNodes() {
    return nodes != null ? nodes : List.of();
  }
}
