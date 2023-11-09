package com.vispana.client.vespa.helpers;

import java.util.Optional;
import org.springframework.web.client.RestClient;

public class Request {

  private static final RestClient restClient = RestClient.create();

  public static <T> T request(String url, Class<T> responseType) {
    return restClient.get().uri(url).retrieve().body(responseType);
  }

  public static <T> Optional<T> requestWithDefaultValue(
      String url, Class<T> responseType, T defaultValue) {
    try {
      return Optional.of(request(url, responseType));
    } catch (Exception exception) {
      return Optional.of(defaultValue);
    }
  }
}
