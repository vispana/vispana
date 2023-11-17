package com.vispana.vespa.query;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import java.nio.channels.UnresolvedAddressException;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component
public class VespaQueryClient {

  private static final RestClient restClient = RestClient.create();

  public String query(String vespaContainerHost, String query) {
    try {
      return restClient
          .post()
          .uri(vespaContainerHost + "/search/")
          .contentType(APPLICATION_JSON)
          .body(query)
          .retrieve()
          .body(String.class);
    } catch (ResourceAccessException e) {
      var exception = ExceptionUtils.getRootCause(e);
      if (exception instanceof UnresolvedAddressException) {
        var message =
            "Failed to reach to Vespa container for host: '"
                + vespaContainerHost
                + "'.\n"
                + "Vespa clusters may have internal access to this address, please check if "
                + "the host is reachable from Vispana. If not, you may configure a routing "
                + "address in Vispana's configuration pointing to a reachable address (e.g"
                + "., a load balancer or a k8s service).";
        throw new RuntimeException(message);
      } else {
        throw e;
      }
    } catch (Exception e) {
      throw new RuntimeException("Error querying Vespa." + e.getMessage(), e);
    }
  }
}
