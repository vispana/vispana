package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.io.IOException;

@JacksonXmlRootElement(localName = "services")
public class Services {

  @JacksonXmlProperty(localName = "content")
  private Content content;

  public static Services fromXml(String xml) {
    XmlMapper xmlMapper = new XmlMapper();
    // To ignore parts off service xml that we don't need
    xmlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    try {
      return xmlMapper.readValue(xml, Services.class);
    } catch (IOException e) {
      throw new RuntimeException("Failed to parse Services xml", e);
    }
  }

  public Content getContent() {
    if (content == null) {
      throw new RuntimeException("No content found in services xml");
    }
    return content;
  }
}
