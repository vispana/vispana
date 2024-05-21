package com.vispana.vespa.state.helpers;

import static com.vispana.vespa.state.helpers.Request.requestGet;

import com.vispana.api.model.VespaVersion;
import com.vispana.client.vespa.model.ConfigModelSchema;

public class VespaVersionFetcher {

  // this API might be useful to get which container is queryable
  public static VespaVersion fetch(String configHost) {
    var url = configHost + "/config/v2/tenant/default/application/default/cloud.config.model";
    String vespaVersion = requestGet(url, ConfigModelSchema.class).getVespaVersion();
    return VespaVersion.fromString(vespaVersion);
  }
}
