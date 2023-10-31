package com.vispana;

import com.vispana.model.VispanaRoot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  private final VespaClient vespaClient;

  @Autowired
  public RootController(VespaClient vespaClient) {this.vespaClient = vespaClient;}

  @GetMapping(value = "/api/", produces = {"application/json"})
  @ResponseBody
  public VispanaRoot root() {
    return vespaClient.assemble();
  }
}
