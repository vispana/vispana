package com.vispana.vespa.state.helpers;

import static com.vispana.vespa.state.helpers.Request.requestGet;

import com.vispana.client.vespa.model.ConfigModelSchema;

public class VespaVersionFetcher {

  // this API might be useful to get which container is queryable
  public static String fetch(String configHost) {
    var url = configHost + "/config/v2/tenant/default/application/default/cloud.config.model";
    return requestGet(url, ConfigModelSchema.class).getVespaVersion();
  }
}
