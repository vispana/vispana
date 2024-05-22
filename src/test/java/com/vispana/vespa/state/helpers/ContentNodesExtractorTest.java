package com.vispana.vespa.state.helpers;

import static com.vispana.Helper.defaultHostsXmlString;
import static com.vispana.Helper.defaultServicesXmlString;
import static org.junit.jupiter.api.Assertions.*;

import com.vispana.Helper;
import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.client.vespa.model.content.Node;
import java.util.List;
import org.junit.jupiter.api.Test;

class ContentNodesExtractorTest {

  @Test
  void contentNodesFromAppPackageForMultiGroup() {
    String hostsXmlString = defaultHostsXmlString();
    String servicesXmlString = defaultServicesXmlString();
    ApplicationPackage applicationPackage =
        new ApplicationPackage("1", servicesXmlString, hostsXmlString);
    List<Node> nodes =
        ContentNodesExtractor.contentNodesFromAppPackage(applicationPackage, "config.host.name");

    assertNotNull(nodes);
    assertEquals(2, nodes.size());
    assertEquals("vespa-content-0-0.vespa.test.svc.cluster.local", nodes.get(0).getHost());
    assertEquals(19103, nodes.get(0).getPort());
    assertEquals(0, nodes.get(0).getGroup());
    assertEquals(0, nodes.get(0).getKey());
    assertEquals("vespa-content-0-1.vespa.test.svc.cluster.local", nodes.get(1).getHost());
    assertEquals(19103, nodes.get(1).getPort());
    assertEquals(0, nodes.get(1).getGroup());
    assertEquals(1, nodes.get(1).getKey());
  }

  @Test
  void contentNodesFromAppPackageForSingleGroup() {
    String hostsXmlString = defaultHostsXmlString();
    String servicesXmlString = Helper.servicesXmlString("xml/services-single-group.xml");
    ApplicationPackage applicationPackage =
        new ApplicationPackage("1", servicesXmlString, hostsXmlString);
    List<Node> nodes =
        ContentNodesExtractor.contentNodesFromAppPackage(applicationPackage, "config.host.name");

    assertNotNull(nodes);
    assertEquals(2, nodes.size());
    assertEquals("vespa-content-0-0.vespa.test.svc.cluster.local", nodes.get(0).getHost());
    assertEquals(19103, nodes.get(0).getPort());
    assertEquals(-1, nodes.get(0).getGroup());
    assertEquals(0, nodes.get(0).getKey());
    assertEquals("vespa-content-0-1.vespa.test.svc.cluster.local", nodes.get(1).getHost());
    assertEquals(19103, nodes.get(1).getPort());
    assertEquals(-1, nodes.get(1).getGroup());
    assertEquals(1, nodes.get(1).getKey());
  }

  @Test
  void contentNodesFromAppPackageForNoGroup() {
    String hostsXmlString = defaultHostsXmlString();
    String servicesXmlString = Helper.servicesXmlString("xml/services-no-group.xml");
    ApplicationPackage applicationPackage =
        new ApplicationPackage("1", servicesXmlString, hostsXmlString);
    List<Node> nodes =
        ContentNodesExtractor.contentNodesFromAppPackage(applicationPackage, "config.host.name");

    assertNotNull(nodes);
    assertEquals(2, nodes.size());
    assertEquals("vespa-content-0-0.vespa.test.svc.cluster.local", nodes.get(0).getHost());
    assertEquals(19103, nodes.get(0).getPort());
    assertEquals(-1, nodes.get(0).getGroup());
    assertEquals(0, nodes.get(0).getKey());
    assertEquals("vespa-content-0-1.vespa.test.svc.cluster.local", nodes.get(1).getHost());
    assertEquals(19103, nodes.get(1).getPort());
    assertEquals(-1, nodes.get(1).getGroup());
    assertEquals(1, nodes.get(1).getKey());
  }

  @Test
  void contentNodesFromAppPackageForSingleHost() {
    String hostsXmlString = ""; // Single host does not require hosts.xml
    String servicesXmlString = Helper.servicesXmlString("xml/services-single-host.xml");
    ApplicationPackage applicationPackage =
        new ApplicationPackage("1", servicesXmlString, hostsXmlString);
    List<Node> nodes =
        ContentNodesExtractor.contentNodesFromAppPackage(applicationPackage, "config.host.name");

    assertNotNull(nodes);
    assertEquals(1, nodes.size());
    assertEquals("config.host.name", nodes.get(0).getHost());
    assertEquals(19103, nodes.get(0).getPort());
    assertEquals(-1, nodes.get(0).getGroup());
    assertEquals(0, nodes.get(0).getKey());
  }
}
