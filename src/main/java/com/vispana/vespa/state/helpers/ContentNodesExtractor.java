package com.vispana.vespa.state.helpers;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.api.model.apppackage.Hosts;
import com.vispana.api.model.apppackage.Services;
import com.vispana.client.vespa.model.content.Node;
import java.util.List;
import java.util.stream.Collectors;

public class ContentNodesExtractor {
  public static final long DEFAULT_RPC_ADMIN_PORT = 19103L;

  public static List<Node> contentNodesFromAppPackage(final ApplicationPackage appPackage) {
    Services services = Services.fromXml(appPackage.servicesContent());
    Hosts hosts = Hosts.fromXml(appPackage.hostsContent());

    return services.getContentGroups().stream()
        .flatMap(group -> group.getNodes().stream().map(n -> createNode(group, n, hosts)))
        .collect(Collectors.toList());
  }

  private static Node createNode(
      final com.vispana.api.model.apppackage.Group group,
      final com.vispana.api.model.apppackage.Node appPackNode,
      final Hosts hosts) {
    Node node = new Node();
    node.setPort(DEFAULT_RPC_ADMIN_PORT);
    node.setKey(Long.parseLong(appPackNode.getDistributionKey()));
    node.setGroup(Long.parseLong(group.getDistributionKey()));

    String hostAlias = appPackNode.getHostAlias();
    String hostName =
        hosts.getHosts().stream()
            .filter(host -> hostAlias.equals(host.getAlias()))
            .map(com.vispana.api.model.apppackage.Host::getName)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Failed to find host for alias: " + hostAlias));
    node.setHost(hostName);
    return node;
  }
}
