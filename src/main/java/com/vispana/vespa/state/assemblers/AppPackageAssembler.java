package com.vispana.vespa.state.assemblers;

import static com.vispana.vespa.state.helpers.Request.requestGet;
import static com.vispana.vespa.state.helpers.Request.requestGetWithDefaultValue;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.client.vespa.model.ApplicationSchema;
import com.vispana.vespa.state.helpers.JavaComponentsFilesystem;

public class AppPackageAssembler {

  public static ApplicationPackage assemble(String appUrl) {
    var appSchema = requestGet(appUrl, ApplicationSchema.class);
    var hostContent = requestGetWithDefaultValue(appUrl + "/content/hosts.xml", String.class, "");
    var servicesContent = requestGet(appUrl + "/content/services.xml", String.class);

    JavaComponentsFilesystem.Filesystem javaComponentsContent =
        JavaComponentsFilesystem.getComponentFilesystem(appUrl);

    return new ApplicationPackage(
        appSchema.getGeneration().toString(), servicesContent, hostContent, javaComponentsContent);
  }
}
