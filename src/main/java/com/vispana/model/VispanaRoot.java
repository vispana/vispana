package com.vispana.model;

import java.util.Map;

public record VispanaRoot(ConfigurationNodes configs, Containers containers,
                          ContentNodes contentNodes, ApplicationPackage applicationPackage) {
}

