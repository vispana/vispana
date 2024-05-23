package com.vispana.api.model.apppackage;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.io.IOException;
import java.util.List;

@JacksonXmlRootElement(localName = "hosts")
public class Hosts {
  @JacksonXmlElementWrapper(useWrapping = false)
  @JacksonXmlProperty(localName = "host")
  List<Host> hosts;

  public static Hosts fromXml(String xml) {
    XmlMapper xmlMapper = new XmlMapper();

    try {
      if (xml == null || xml.isEmpty()) {
        return new Hosts();
      }
      return xmlMapper.readValue(xml, Hosts.class);
    } catch (IOException e) {
      throw new RuntimeException("Failed to parse Hosts xml", e);
    }
  }

  public List<Host> getHosts() {
    return hosts == null ? List.of() : hosts.stream().toList();
  }
}
