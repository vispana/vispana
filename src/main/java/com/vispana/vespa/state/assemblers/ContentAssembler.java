package com.vispana.vespa.state.assemblers;

import static com.vispana.vespa.state.helpers.ProcessStatus.processStatus;
import static com.vispana.vespa.state.helpers.Request.requestGet;
import static com.vispana.vespa.state.helpers.SystemMetrics.systemMetrics;
import static com.vispana.vespa.state.helpers.VespaConfigModelFetcher.fetchContentNodes;
import static java.util.stream.Collectors.groupingBy;

import com.vispana.api.model.Host;
import com.vispana.api.model.content.ContentCluster;
import com.vispana.api.model.content.ContentData;
import com.vispana.api.model.content.ContentNode;
import com.vispana.api.model.content.ContentNodes;
import com.vispana.api.model.content.ContentOverview;
import com.vispana.api.model.content.Group;
import com.vispana.api.model.content.GroupKey;
import com.vispana.api.model.content.Schema;
import com.vispana.api.model.content.SchemaDocCount;
import com.vispana.client.vespa.model.ClusterProperty;
import com.vispana.client.vespa.model.ContentDistributionClusterSchema;
import com.vispana.client.vespa.model.ContentDistributionSchema;
import com.vispana.client.vespa.model.IndexInfoSchema;
import com.vispana.client.vespa.model.MetricsNode;
import com.vispana.client.vespa.model.SearchDispatchNodesSchema;
import com.vispana.client.vespa.model.SearchDispatchSchema;
import com.vispana.client.vespa.model.content.Node;
import com.vispana.vespa.state.helpers.NameExtractorFromUrl;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ContentAssembler {

  public static ContentNodes assemble(
      String configHost,
      String vespaVersion,
      Map<String, MetricsNode> vespaMetrics,
      String appUrl) {
    var contentDistributionUrl = configHost + "/config/v1/vespa.config.content.distribution/";
    var contentClusters =
        requestGet(contentDistributionUrl, ContentDistributionSchema.class).getConfigs().stream()
            .map(NameExtractorFromUrl::nameFromUrl)
            .map(
                clusterName -> {
                  var dispatcher = fetchDispatcherData(configHost, clusterName, vespaVersion);
                  var schemas = fetchSchemas(configHost, clusterName);
                  var contentDistribution = fetchContentDistributionData(configHost, clusterName);
                  var distribution =
                      contentDistribution.getCluster().getAdditionalProperties().get(clusterName);

                  var redundancy = distribution.getRedundancy().intValue();
                  var copies = distribution.getReadyCopies().intValue();
                  var hostsPerGroup = hostsPerGroup(distribution);
                  var hostsCount = hostsPerGroup.size();
                  var contentOverview =
                      new ContentOverview(hostsCount, copies, redundancy, hostsPerGroup);

                  var contentNodes = contentNodes(vespaMetrics, clusterName, dispatcher);

                  var contentData = fetchSchemaContent(appUrl, schemas, contentNodes);

                  return new ContentCluster(
                      clusterName, contentOverview, contentData, contentNodes);
                })
            .toList();

    return new ContentNodes(contentClusters);
  }

  private static List<ContentData> fetchSchemaContent(
      String appUrl, List<String> schemas, List<ContentNode> contentNodes) {
    return schemas.stream()
        .map(
            schemaName -> {
              var schemaUrl = appUrl + "/content/schemas/" + schemaName + ".sd";
              var schemaContent = requestGet(schemaUrl, String.class);

              var contentNodeByGroup =
                  contentNodes.stream()
                      .collect(groupingBy(contentNode -> contentNode.group().key()));

              var schemaDocCounts = countDocuments(schemaName, contentNodeByGroup);

              return new ContentData(new Schema(schemaName, schemaContent), schemaDocCounts);
            })
        .toList();
  }

  private static TreeMap<GroupKey, Integer> hostsPerGroup(ClusterProperty distribution) {
    return distribution.getGroup().stream()
        .filter(group -> !"invalid".equals(group.getIndex()))
        .map(
            group -> {
              var groupName = new GroupKey(group.getName());
              // might be interesting to filter out retired nodes
              var size = group.getNodes().size();
              return Map.entry(groupName, size);
            })
        .collect(
            Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (s, ignore) -> s,
                () -> new TreeMap<>(Comparator.comparing(GroupKey::key))));
  }

  private static List<SchemaDocCount> countDocuments(
      String schemaName, Map<GroupKey, List<ContentNode>> contentNodeByGroup) {
    return contentNodeByGroup.entrySet().stream()
        .map(
            keySet -> {
              var groupKey = keySet.getKey();
              var nodes = keySet.getValue();
              var docCount =
                  nodes.stream().flatMap(node -> count(schemaName, node)).reduce(0L, Long::sum);
              return new SchemaDocCount(groupKey, docCount);
            })
        .toList();
  }

  private static Stream<Long> count(String schemaName, ContentNode node) {
    return node.otherMetrics().getServices().stream()
        .flatMap(
            service ->
                service.getMetrics().stream()
                    .filter(metrics -> schemaName.equals(metrics.getDimensions().getDocumenttype()))
                    .map(
                        metric -> {
                          var documentsActive =
                              metric.getValues().getContentProtonDocumentdbDocumentsActiveLast();
                          return Objects.requireNonNullElse(documentsActive, 0L);
                        }));
  }

  private static List<String> fetchSchemas(String configHost, String clusterName) {
    var url =
        configHost + "/config/v1/search.config.index-info/" + clusterName + "/?recursive=true";
    return requestGet(url, IndexInfoSchema.class).getConfigs().stream()
        .map(NameExtractorFromUrl::nameFromUrl)
        .filter(schema -> !("cluster." + clusterName).equals(schema))
        .filter(schema -> !"union".equals(schema))
        .toList();
  }

  private static List<Node> fetchDispatcherData(
      String configHost, String clusterName, String vespaVersion) {

    String[] version = vespaVersion.split("\\.");

    //Assume semantic versioning major.minor.patch
    if (version.length == 3) {
      throw new RuntimeException("Failed to parse vespa version");
    }

    int majorVersion = Integer.parseInt(version[0]);
    int minorVersion = Integer.parseInt(version[1]);

    if (majorVersion == 7) {
      var dispatcherUrl =
          configHost + "/config/v1/vespa.config.search.dispatch/" + clusterName + "/search";
      return requestGet(dispatcherUrl, SearchDispatchSchema.class).getNode();
    } else if (majorVersion == 8 && minorVersion < 323) {
      var dispatcherUrl =
          configHost
          + "/config/v2/tenant/default/application/default/vespa.config.search.dispatch-nodes/"
          + clusterName
          + "/search";
      return requestGet(dispatcherUrl, SearchDispatchNodesSchema.class).getNode();
    } else {
      // For Vespa 8.323.45 and above
      return fetchContentNodes(configHost);
    }
  }

  private static ContentDistributionClusterSchema fetchContentDistributionData(
      String configHost, String contentCluster) {
    var url = configHost + "/config/v1/vespa.config.content.distribution/" + contentCluster;
    return requestGet(url, ContentDistributionClusterSchema.class);
  }

  private static List<ContentNode> contentNodes(
      Map<String, MetricsNode> vespaMetrics, String clusterName, List<Node> dispatcher) {
    return dispatcher.stream().map(node -> contentNode(node, vespaMetrics, clusterName)).toList();
  }

  private static ContentNode contentNode(
      Node node, Map<String, MetricsNode> vespaMetrics, String clusterName) {

    var host = new Host(node.getHost(), node.getPort().intValue());
    var group = new Group(new GroupKey(node.getGroup().toString()), node.getKey().toString());

    var processStatus = processStatus(node.getHost(), vespaMetrics);

    var metrics = vespaMetrics.get(host.hostname());
    var systemMetrics = systemMetrics(metrics);

    return new ContentNode(clusterName, host, processStatus, systemMetrics, group, metrics);
  }
}
