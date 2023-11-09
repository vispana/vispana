package com.vispana.api;

import com.vispana.api.model.VispanaRoot;
import com.vispana.client.vespa.VespaClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

  private final VespaClient vespaClient;

  @Autowired
  public MainController(VespaClient vespaClient) {
    this.vespaClient = vespaClient;
  }

  @GetMapping(
      value = "/api/overview",
      produces = {"application/json"})
  @ResponseBody
  public VispanaRoot root(@RequestParam(name = "config_host") String configHost) {
    return vespaClient.vespaState(configHost);
  }
}
