package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Host {

  @JacksonXmlProperty(localName = "name", isAttribute = true)
  private String name;

  @JacksonXmlProperty(localName = "alias")
  private String alias;

  // getters and setters
  public String getName() {
    return name;
  }

  public String getAlias() {
    return alias;
  }
}
