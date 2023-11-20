package com.vispana.vespa.state.helpers;

import static com.vispana.vespa.state.helpers.Request.requestGet;

import java.util.List;

public class ApplicationUrlFetcher {
  public static String fetch(String configHost) {
    var url = configHost + "/application/v2/tenant/default/application/?recursive=true";
    var applications = List.of(requestGet(url, String[].class));
    if (applications.isEmpty()) {
      throw new RuntimeException("Couldn't find any application deployed to Vespa");
    }
    // assumes a single app
    if (applications.size() > 1) {
      throw new RuntimeException(
          "Unexpected number of application deployed: " + applications.size());
    }

    return applications.get(0);
  }
}
