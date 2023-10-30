package com.vispana;

import com.vispana.model.ApplicationPackage;
import com.vispana.model.ConfigurationCluster;
import com.vispana.model.ConfigurationNodes;
import com.vispana.model.ContainerCluster;
import com.vispana.model.Containers;
import com.vispana.model.ContentNodeCluster;
import com.vispana.model.ContentNodes;
import com.vispana.model.VispanaRoot;
import java.util.Map;
import org.springframework.stereotype.Component;


@Component
public class VespaClient {

  public VispanaRoot assemble() {
    var configurationNodes = Map.of("admin", new ConfigurationCluster("admin", "localhost", 19071));
    var containerNodes = Map.of("feed", new ContainerCluster(), "query", new ContainerCluster());
    var contentNodes = Map.of("content", new ContentNodeCluster());

    return new VispanaRoot(
        new ConfigurationNodes(configurationNodes),
        new Containers(containerNodes),
        new ContentNodes(contentNodes),
        new ApplicationPackage()
    );
  }
}
