package com.vispana.client.vespa.helpers;

public class NameExtractorFromUrl {
  public static String nameFromUrl(String containerClusterUrl) {
    var splitUrl = containerClusterUrl.split("/");
    return splitUrl[splitUrl.length - 1];
  }
}
