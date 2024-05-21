package com.vispana.api.model.apppackage;

import static com.vispana.Helper.defaultHostsXmlString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class HostsTest {

  @Test
  void deserializeXml() {
    String hostsXmlString = defaultHostsXmlString();

    Hosts hosts = Hosts.fromXml(hostsXmlString);

    assertNotNull(hosts);
    assertEquals(8, hosts.getHosts().size());
    assertEquals(
        "vespa-content-0-0.vespa.test.svc.cluster.local", hosts.getHosts().get(6).getName());
    assertEquals("content-0-0", hosts.getHosts().get(6).getAlias());
    assertEquals(
        "vespa-content-0-1.vespa.test.svc.cluster.local", hosts.getHosts().get(7).getName());
    assertEquals("content-0-1", hosts.getHosts().get(7).getAlias());
  }
}
