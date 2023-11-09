package com.vispana.client.vespa.helpers;

import static com.vispana.client.vespa.helpers.Request.request;

import com.vispana.client.vespa.model.ConfigModelSchema;

public class VespaVersionFetcher {

  // this API might be useful to get which container is queryable
  public static String fetch(String configHost) {
    var url = configHost + "/config/v2/tenant/default/application/default/cloud.config.model";
    return request(url, ConfigModelSchema.class).getVespaVersion();
  }
}
