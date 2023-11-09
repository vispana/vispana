package com.vispana.client.vespa.helpers;

import org.springframework.web.client.RestClient;

public class Request {
  private static final RestClient restClient = RestClient.create();

  public static <T> T request(String url, Class<T> responseType) {
    return restClient.get().uri(url).retrieve().body(responseType);
  }
}
