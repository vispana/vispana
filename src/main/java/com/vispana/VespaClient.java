package com.vispana;

import com.vispana.model.*;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;


@Component
public class VespaClient {

    public VispanaRoot assemble() {
        var configurationNodes = configNodes();
        var containerNodes = getContainerNodes();
        var contentNodes = Map.of("content", new ContentNodeCluster());

        return new VispanaRoot(
                new ConfigurationNodes(configurationNodes),
                new ContainerNodes(containerNodes),
                new ContentNodes(contentNodes),
                new ApplicationPackage()
        );
    }

    private static Map<String, List<ContainerNode>> getContainerNodes() {
        var containerNodeOne = containerNode(
                "node1",
                new Host("vespa-container-0.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.DOWN,
                        "vespa.container", Status.UP,
                        "vespa.logd", Status.UNKNOWN,
                        "vespa.metricsproxy-container", Status.UP),
                new HostMetrics(0.2786367906108, 0.578492, 0.852123));

        var containerNodeTwo = containerNode(
                "node2",
                new Host("vespa-container-1.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.UP,
                        "vespa.container", Status.UP,
                        "vespa.logd", Status.UNKNOWN,
                        "vespa.metricsproxy-container", Status.UP),
                new HostMetrics(88.2786367906108, 37.8492, 3.852123));

        var containerNodeThree = containerNode(
                "node3",
                new Host("vespa-container-2.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.UP,
                        "vespa.container", Status.UP,
                        "vespa.logd", Status.DOWN,
                        "vespa.metricsproxy-container", Status.UNKNOWN),
                new HostMetrics(50.2786367906108, 37.8492, 3.852123));


        return Map.of("feed", List.of(containerNodeOne, containerNodeTwo), "query", List.of(containerNodeThree));
    }

    private static ContainerNode containerNode(String id, Host host, Map<String, Status> processes, HostMetrics hostMetrics) {
        return new ContainerNode(id, host, processes, hostMetrics);
    }

    private static Map<String, List<ConfigurationNode>> configNodes() {
        var configNodeOne = configNode(
                "node1",
                new Host("vespa-config-0.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.DOWN,
                        "vespa.configserver", Status.UP,
                        "vespa.container-clustercontroller", Status.DOWN,
                        "vespa.logd", Status.UP,
                        "vespa.metricsproxy-container", Status.UP,
                        "vespa.slobrok", Status.UP),
                new HostMetrics(0.2786367906108, 0.578492, 0.852123));

        var configNodeTwo = configNode(
                "node2",
                new Host("vespa-config-1.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.UP,
                        "vespa.configserver", Status.DOWN,
                        "vespa.container-clustercontroller", Status.UP,
                        "vespa.logd", Status.DOWN,
                        "vespa.metricsproxy-container", Status.UP,
                        "vespa.slobrok", Status.UNKNOWN),
                new HostMetrics(88.2786367906108, 37.8492, 3.852123));

        var configNodeThree = configNode(
                "node3",
                new Host("vespa-config-2.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.UP,
                        "vespa.configserver", Status.UP,
                        "vespa.container-clustercontroller", Status.UP,
                        "vespa.logd", Status.UNKNOWN,
                        "vespa.metricsproxy-container", Status.UP,
                        "vespa.slobrok", Status.UNKNOWN),
                new HostMetrics(50.2786367906108, 37.8492, 3.852123));


        return Map.of("admin", List.of(configNodeOne, configNodeTwo), "admin2", List.of(configNodeThree));
    }

    private static ConfigurationNode configNode(String id, Host host, Map<String, Status> processes, HostMetrics hostMetrics) {
        return new ConfigurationNode(id, host, processes, hostMetrics);
    }
}
