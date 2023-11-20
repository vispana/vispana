package com.vispana.vespa.state.helpers;

public class NameExtractorFromUrl {
  public static String nameFromUrl(String containerClusterUrl) {
    var splitUrl = containerClusterUrl.split("/");
    return splitUrl[splitUrl.length - 1];
  }
}
