package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Node {

  @JacksonXmlProperty(localName = "hostalias", isAttribute = true)
  private String hostAlias;

  @JacksonXmlProperty(localName = "distribution-key", isAttribute = true)
  private String distributionKey;

  public String getHostAlias() {
    return hostAlias;
  }

  public String getDistributionKey() {
    return distributionKey;
  }
}
