package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;

public class TopGroup {

  @JacksonXmlProperty(isAttribute = true)
  private String name;

  @JacksonXmlElementWrapper(useWrapping = false)
  @JacksonXmlProperty(localName = "group")
  List<Group> groups;

  public List<Group> getGroups() {
    return groups;
  }
}
