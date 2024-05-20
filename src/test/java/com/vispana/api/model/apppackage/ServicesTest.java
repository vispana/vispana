package com.vispana.api.model.apppackage;

import static com.vispana.Helper.defaultServicesXmlString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;
import org.junit.jupiter.api.Test;

class ServicesTest {

  @Test
  void fromXml() {
    String servicesXmlString = defaultServicesXmlString();

    Services services = Services.fromXml(servicesXmlString);
    List<Group> groups = services.getContentGroups();
    assertNotNull(services);
    assertEquals(1, groups.size());
    assertEquals("group-0-0", groups.get(0).getName());
    assertEquals("0", groups.get(0).getDistributionKey());

    assertEquals(2, groups.get(0).getNodes().size());
    assertEquals("0", groups.get(0).getNodes().get(0).getDistributionKey());
    assertEquals("content-0-0", groups.get(0).getNodes().get(0).getHostAlias());
    assertEquals("1", groups.get(0).getNodes().get(1).getDistributionKey());
    assertEquals("content-0-1", groups.get(0).getNodes().get(1).getHostAlias());
  }
}
