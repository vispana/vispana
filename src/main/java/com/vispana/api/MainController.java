package com.vispana.api;

import com.vispana.api.model.VispanaRoot;
import com.vispana.vespa.query.VespaQueryClient;
import com.vispana.vespa.state.VespaStateClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

  private final VespaStateClient vespaStateClient;
  private final VespaQueryClient vespaQueryClient;

  @Autowired
  public MainController(VespaStateClient vespaStateClient, VespaQueryClient vespaQueryClient) {
    this.vespaStateClient = vespaStateClient;
    this.vespaQueryClient = vespaQueryClient;
  }

  @GetMapping(
      value = "/api/overview",
      produces = {"application/json"})
  @ResponseBody
  public VispanaRoot root(@RequestParam(name = "config_host") String configHost) {
    return vespaStateClient.vespaState(configHost);
  }

  @PostMapping(
      value = "/api/query",
      produces = {"application/json"})
  @ResponseBody
  public String query(
      @RequestParam(name = "container_host") String containerHost, @RequestBody String query) {
    return vespaQueryClient.query(containerHost, query);
  }
}
