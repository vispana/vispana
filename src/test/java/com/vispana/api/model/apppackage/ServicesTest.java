package com.vispana.api.model.apppackage;

import static com.vispana.Helper.defaultServicesXmlString;
import static com.vispana.Helper.servicesXmlString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;
import org.junit.jupiter.api.Test;

class ServicesTest {

  @Test
  void fromXmlForMultiGroup() {
    String servicesXmlString = defaultServicesXmlString();

    Services services = Services.fromXml(servicesXmlString);
    List<Group> groups = services.getContent().getGroups();
    assertNotNull(services);
    assertEquals(1, groups.size());
    assertEquals(0, services.getContent().getNodes().size());
    assertEquals("group-0-0", groups.get(0).getName());
    assertEquals("0", groups.get(0).getDistributionKey());

    assertEquals(2, groups.get(0).getNodes().size());
    assertEquals("0", groups.get(0).getNodes().get(0).getDistributionKey());
    assertEquals("content-0-0", groups.get(0).getNodes().get(0).getHostAlias());
    assertEquals("1", groups.get(0).getNodes().get(1).getDistributionKey());
    assertEquals("content-0-1", groups.get(0).getNodes().get(1).getHostAlias());
  }

  @Test
  void fromXmlForNoGroups() {
    String servicesXmlString = servicesXmlString("xml/services-no-group.xml");
    Services services = Services.fromXml(servicesXmlString);
    assertNotNull(services);
    assertEquals(0, services.getContent().getGroups().size());
    assertEquals(2, services.getContent().getNodes().size());
    assertEquals("0", services.getContent().getNodes().get(0).getDistributionKey());
    assertEquals("content-0-0", services.getContent().getNodes().get(0).getHostAlias());
    assertEquals("1", services.getContent().getNodes().get(1).getDistributionKey());
    assertEquals("content-0-1", services.getContent().getNodes().get(1).getHostAlias());
  }

  @Test
  void fromXmlForSingleHost() {
    String servicesXmlString = servicesXmlString("xml/services-single-host.xml");

    Services services = Services.fromXml(servicesXmlString);
    assertNotNull(services);
    assertEquals(0, services.getContent().getGroups().size());
    assertEquals(1, services.getContent().getNodes().size());
    assertEquals("0", services.getContent().getNodes().get(0).getDistributionKey());
    assertEquals("content-0-0", services.getContent().getNodes().get(0).getHostAlias());
  }

  @Test
  void fromXmlForSingleGroup() {
    String servicesXmlString = servicesXmlString("xml/services-single-group.xml");

    Services services = Services.fromXml(servicesXmlString);
    List<Group> groups = services.getContent().getGroups();
    assertNotNull(services);
    assertEquals(1, services.getContent().getGroups().size());
    assertEquals(0, services.getContent().getNodes().size());
    assertEquals("top-group", groups.get(0).getName());
    assertEquals("-1", groups.get(0).getDistributionKey());

    assertEquals(2, groups.get(0).getNodes().size());
    assertEquals("0", groups.get(0).getNodes().get(0).getDistributionKey());
    assertEquals("content-0-0", groups.get(0).getNodes().get(0).getHostAlias());
    assertEquals("1", groups.get(0).getNodes().get(1).getDistributionKey());
    assertEquals("content-0-1", groups.get(0).getNodes().get(1).getHostAlias());
  }
}
