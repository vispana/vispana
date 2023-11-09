package com.vispana.client.vespa.assemblers;

import static com.vispana.client.vespa.helpers.Request.request;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.client.vespa.model.ApplicationSchema;

public class AppPackageAssembler {

  public static ApplicationPackage assemble(String appUrl) {
    var appSchema = request(appUrl, ApplicationSchema.class);
    var hostContent = request(appUrl + "/content/hosts.xml", String.class);
    var servicesContent = request(appUrl + "/content/services.xml", String.class);

    return new ApplicationPackage(
        appSchema.getGeneration().toString(), servicesContent, hostContent);
  }
}
