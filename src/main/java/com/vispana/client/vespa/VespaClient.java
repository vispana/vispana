package com.vispana.client.vespa;

import com.vispana.api.model.VispanaRoot;

public interface VespaClient {
  VispanaRoot vespaState(String configHost);
}
