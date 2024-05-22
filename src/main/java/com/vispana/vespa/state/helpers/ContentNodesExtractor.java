package com.vispana.vespa.state.helpers;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.api.model.apppackage.Group;
import com.vispana.api.model.apppackage.Hosts;
import com.vispana.api.model.apppackage.Services;
import com.vispana.client.vespa.model.content.Node;
import java.util.List;
import java.util.stream.Collectors;

public class ContentNodesExtractor {

  public static final long DEFAULT_RPC_ADMIN_PORT = 19103L;
  public static final String UNKNOWN = "unknown";

  public static List<Node> contentNodesFromAppPackage(
      final ApplicationPackage appPackage, final String configHostName) {
    Services services = Services.fromXml(appPackage.servicesContent());
    Hosts hosts = Hosts.fromXml(appPackage.hostsContent());

    if (services.getContent() == null) {
      throw new RuntimeException("No content found in services xml");
    }

    // content can not have both groups and nodes
    if (services.getContent().hasNodes()) {
      // is single node vespa setup
      if (services.getContent().getNodes().size() == 1) {
        return List.of(
            createNode(
                new Group(), services.getContent().getNodes().get(0), hosts, configHostName));
      }
      return services.getContent().getNodes().stream()
          .map(n -> createNode(new Group(), n, hosts, null))
          .collect(Collectors.toList());
    }

    return services.getContent().getGroups().stream()
        .flatMap(group -> group.getNodes().stream().map(n -> createNode(group, n, hosts, null)))
        .collect(Collectors.toList());
  }

  private static Node createNode(
      final com.vispana.api.model.apppackage.Group group,
      final com.vispana.api.model.apppackage.Node appPackNode,
      final Hosts hosts,
      final String singleNodeHostName) {
    Node node = new Node();
    node.setPort(DEFAULT_RPC_ADMIN_PORT);
    node.setKey(Long.parseLong(appPackNode.getDistributionKey()));
    node.setGroup(Long.parseLong(group.getDistributionKey()));

    String hostAlias = appPackNode.getHostAlias();

    String hostName = singleNodeHostName;
    if (hosts != null && !hosts.getHosts().isEmpty()) {
      hostName =
          hosts.getHosts().stream()
              .filter(host -> hostAlias.equals(host.getAlias()))
              .map(com.vispana.api.model.apppackage.Host::getName)
              .findFirst()
              .orElseThrow(
                  () -> new RuntimeException("Failed to find host for alias: " + hostAlias));
    }
    node.setHost(hostName);
    return node;
  }
}
