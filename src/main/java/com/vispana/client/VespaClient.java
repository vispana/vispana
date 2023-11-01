package com.vispana.client;

import com.vispana.api.model.*;

import java.util.List;
import java.util.Map;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.api.model.config.ConfigCluster;
import com.vispana.api.model.config.ConfigNode;
import com.vispana.api.model.config.ConfigNodes;
import com.vispana.api.model.container.ContainerCluster;
import com.vispana.api.model.container.ContainerNode;
import com.vispana.api.model.container.ContainerNodes;
import com.vispana.api.model.content.*;
import org.springframework.stereotype.Component;


@Component
public class VespaClient {

    public VispanaRoot assemble() {
        var configurationNodes = configNodes();
        var containerNodes = containerNodes();
        var contentNodes = contentNodes();

        return new VispanaRoot(
                new ConfigNodes(configurationNodes),
                new ContainerNodes(containerNodes),
                new ContentNodes(contentNodes),
                new ApplicationPackage()
        );
    }

    private static List<ContentCluster> contentNodes() {
        var contentNodeOne = contentNode(
                "node1",
                new Host("vespa-content-0.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.DOWN,
                        "vespa.container", Status.UP,
                        "vespa.logd", Status.UNKNOWN,
                        "vespa.metricsproxy-container", Status.UP),
                new HostMetrics(0.2786367906108, 0.578492, 0.852123),
                new Group(new GroupKey("0"), "0"));

        var contentNodeTwo = contentNode(
                "node2",
                new Host("vespa-content-1.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.UP,
                        "vespa.container", Status.UP,
                        "vespa.logd", Status.UNKNOWN,
                        "vespa.metricsproxy-container", Status.UP),
                new HostMetrics(88.2786367906108, 37.8492, 3.852123),
                new Group(new GroupKey("0"), "1"));

        var contentNodeThree = contentNode(
                "node3",
                new Host("vespa-content-2.vespa.sparse-suggestions.svc.cluster.local", 19071),
                Map.of("vespa.config-sentinel", Status.UP,
                        "vespa.container", Status.UP,
                        "vespa.logd", Status.DOWN,
                        "vespa.metricsproxy-container", Status.UNKNOWN),
                new HostMetrics(50.2786367906108, 37.8492, 3.852123),
                new Group(new GroupKey("1"), "0"));


        var contentClusterOne = new ContentCluster(
                "content1",
                new ContentOverview(2, 2, 2, Map.of(new GroupKey("0"), 2, new GroupKey("1"), 2)),
                List.of(
                        new ContentData(new Schema("artist20230411", "schema artist20230411 {}"), List.of(new SchemaDocCount(new GroupKey("0"), 49321345L), new SchemaDocCount(new GroupKey("1"), 49321341L))),
                        new ContentData(new Schema("suggestion20231017", "schema suggestion20231017 {}"), List.of(new SchemaDocCount(new GroupKey("0"), 100L), new SchemaDocCount(new GroupKey("1"), 1231L)))
                ),
                List.of(contentNodeOne, contentNodeTwo));

        var contentClusterTwo = new ContentCluster(
                "content2",
                new ContentOverview(2, 2, 2, Map.of(new GroupKey("0"), 2)),
                List.of(new ContentData(new Schema("artist20230411", "schema artist20230411 {}"), List.of(new SchemaDocCount(new GroupKey("0"), 3L)))),
                List.of(contentNodeThree));
        return List.of(contentClusterOne, contentClusterTwo);
    }

    private static ContentNode contentNode(String id, Host host, Map<String, Status> processes, HostMetrics hostMetrics, Group group) {
        return new ContentNode(id, host, processes, hostMetrics, group);
    }


    private static List<ContainerCluster> containerNodes() {
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


        return List.of(new ContainerCluster("feed", List.of(containerNodeOne, containerNodeTwo)), new ContainerCluster("query", List.of(containerNodeThree)));
    }

    private static ContainerNode containerNode(String id, Host host, Map<String, Status> processes, HostMetrics hostMetrics) {
        return new ContainerNode(id, host, processes, hostMetrics);
    }

    private static List<ConfigCluster> configNodes() {
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


        return List.of(new ConfigCluster("admin", List.of(configNodeOne, configNodeTwo)), new ConfigCluster("admin2", List.of(configNodeThree)));
    }

    private static ConfigNode configNode(String id, Host host, Map<String, Status> processes, HostMetrics hostMetrics) {
        return new ConfigNode(id, host, processes, hostMetrics);
    }
}
