package com.vispana.vespa.state.helpers;

import org.springframework.web.client.RestClient;

public class Request {

  private static final RestClient restClient = RestClient.create();

  public static <T> T requestGet(String url, Class<T> responseType) {
    return restClient.get().uri(url).retrieve().body(responseType);
  }

  public static <T> T requestGetWithDefaultValue(
      String url, Class<T> responseType, T defaultValue) {
    try {
      return requestGet(url, responseType);
    } catch (Exception exception) {
      return defaultValue;
    }
  }
}
