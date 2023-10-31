package com.vispana.model;

public record VispanaRoot(ConfigurationNodes configs, ContainerNodes containers, ContentNodes contentNodes,
                          ApplicationPackage applicationPackage) {
}

