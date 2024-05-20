package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;

public class Content {

  @JacksonXmlProperty(isAttribute = true)
  private String id;

  @JacksonXmlProperty(localName = "group")
  private TopGroup topGroup;

  protected List<Group> getContentGroups() {
    return topGroup != null ? topGroup.getGroups() : List.of();
  }
}
