package com.vispana.vespa.state.helpers;

import static com.vispana.vespa.state.helpers.Request.requestGet;

import com.vispana.client.vespa.model.ConfigModelSchema;
import com.vispana.client.vespa.model.Host;
import com.vispana.client.vespa.model.Port__1;
import com.vispana.client.vespa.model.Service__1;
import com.vispana.client.vespa.model.content.Node;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class VespaConfigModelFetcher {

  public static final long DEFAULT_RPC_ADMIN_PORT = 19103L;
  public static final String ADMIN_PORT_TAG = "admin";
  public static final String CONFIG_MODEL_PATH =
      "/config/v2/tenant/default/application/default/cloud.config.model";
  public static final String SEARCHNODE = "searchnode";
  public static final String CONTENT = "content";

  public static List<Node> fetchContentNodes(String configHost) {
    var url = configHost + CONFIG_MODEL_PATH;
    ConfigModelSchema configModelSchema = requestGet(url, ConfigModelSchema.class);
    List<Host> contentHosts = getContentHosts(configModelSchema);
    return contentHosts.stream().map(hostToNode()).collect(Collectors.toList());
  }

  private static List<Host> getContentHosts(final ConfigModelSchema configModelSchema) {
    return configModelSchema.getHosts().stream().filter(contentHostFilter()).toList();
  }

  private static Function<? super Host, Node> hostToNode() {
    return host -> {
      Node node = new Node();
      List<Service__1> service__1Stream =
          host.getServices().stream().filter(searchNodePredicate()).collect(Collectors.toList());
      List<String> splitHostName = List.of(host.getName().split(("[-.]")));

      // Assuming host is of format <service>-<key>-<group>-<key>.domain.com
      if (splitHostName.size() >= 4) {
        node.setGroup(Long.parseLong(splitHostName.get(2)));
        node.setKey(Long.parseLong(splitHostName.get(3)));
      } else {
        node.setGroup(0L);
        node.setKey(0L);
      }

      node.setHost(host.getName());
      node.setPort(getPort(service__1Stream));
      return node;
    };
  }

  private static Long getPort(final List<Service__1> service__1Stream) {
    return service__1Stream.stream()
        .flatMap(service__1 -> service__1.getPorts().stream())
        .filter(rpcAdminPort())
        .map(Port__1::getNumber)
        .toList()
        .stream()
        .findFirst()
        .orElse(DEFAULT_RPC_ADMIN_PORT);
  }

  private static Predicate<Port__1> rpcAdminPort() {
    return port -> port.getTags().contains(ADMIN_PORT_TAG);
  }

  private static Predicate<Host> contentHostFilter() {
    return host -> host.getServices().stream().anyMatch(searchNodePredicate());
  }

  private static Predicate<Service__1> searchNodePredicate() {
    return service ->
        service.getType().equals(SEARCHNODE) && service.getClustername().equals(CONTENT);
  }
}
