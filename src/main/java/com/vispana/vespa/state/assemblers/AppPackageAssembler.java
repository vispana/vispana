package com.vispana.vespa.state.assemblers;

import static com.vispana.vespa.state.helpers.Request.requestGet;
import static com.vispana.vespa.state.helpers.Request.requestGetWithDefaultValue;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.client.vespa.model.ApplicationSchema;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppPackageAssembler {

  public static ApplicationPackage assemble(String appUrl) {
    var appSchema = requestGet(appUrl, ApplicationSchema.class);
    var hostContent = requestGetWithDefaultValue(appUrl + "/content/hosts.xml", String.class, "");
    var servicesContent = requestGet(appUrl + "/content/services.xml", String.class);

    List<String> modelsContent =
        requestGetWithDefaultValue(appUrl + "/content/models/", List.class, List.of());

    // Parse JSON array and extract model names
    if (modelsContent.isEmpty()) {
      modelsContent = List.of();
    } else {
      try {
        modelsContent =
            modelsContent.stream()
                .map(
                    fullUrl -> {
                      // Subtract filename from URL
                      int lastSlashIndex = fullUrl.lastIndexOf('/');
                      return lastSlashIndex >= 0 ? fullUrl.substring(lastSlashIndex + 1) : fullUrl;
                    })
                .toList();
      } catch (Exception e) {
        // Handle JSON parsing error - return empty list or throw exception
        modelsContent = List.of("Error parsing models");
      }
    }

    Map<String, String> queryProfilesContent = new HashMap<String, String>();
    List<String> queryProfileNames =
        requestGetWithDefaultValue(
            appUrl + "/content/search/query-profiles/", List.class, List.of());
    if (!queryProfileNames.isEmpty()) {
      try {
        queryProfileNames =
            queryProfileNames.stream()
                .map(
                    fullUrl -> {
                      // Subtract filename from URL
                      int lastSlashIndex = fullUrl.lastIndexOf('/');
                      return lastSlashIndex >= 0 ? fullUrl.substring(lastSlashIndex + 1) : fullUrl;
                    })
                .filter(name -> name.endsWith(".xml"))
                .toList();
        for (String queryProfileName : queryProfileNames) {
          queryProfilesContent.put(
              queryProfileName,
              requestGetWithDefaultValue(
                  appUrl + "/content/search/query-profiles/" + queryProfileName, String.class, ""));
        }
      } catch (Exception e) {
        queryProfilesContent = Map.of("Error", "Error parsing query profiles");
      }
    }

    Map<String, String> queryProfileTypesContent = new HashMap<String, String>();
    List<String> queryProfileTypeNames =
        requestGetWithDefaultValue(
            appUrl + "/content/search/query-profiles/types/", List.class, List.of());
    if (!queryProfileTypeNames.isEmpty()) {
      try {
        queryProfileTypeNames =
            queryProfileTypeNames.stream()
                .map(
                    fullUrl -> {
                      // Subtract filename from URL
                      int lastSlashIndex = fullUrl.lastIndexOf('/');
                      return lastSlashIndex >= 0 ? fullUrl.substring(lastSlashIndex + 1) : fullUrl;
                    })
                .filter(name -> name.endsWith(".xml"))
                .toList();
        for (String queryProfileTypeName : queryProfileTypeNames) {
          queryProfileTypesContent.put(
              queryProfileTypeName,
              requestGetWithDefaultValue(
                  appUrl + "/content/search/query-profiles/types/" + queryProfileTypeName,
                  String.class,
                  ""));
        }
      } catch (Exception e) {
        queryProfileTypesContent = Map.of("Error", "Error parsing query profile types");
      }
    }

    return new ApplicationPackage(
        appSchema.getGeneration().toString(),
        servicesContent,
        hostContent,
        modelsContent,
        queryProfilesContent,
        queryProfileTypesContent);
  }
}
