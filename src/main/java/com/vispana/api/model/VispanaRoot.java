package com.vispana.api.model;

import com.vispana.api.model.apppackage.ApplicationPackage;
import com.vispana.api.model.config.ConfigNodes;
import com.vispana.api.model.container.ContainerNodes;
import com.vispana.api.model.content.ContentNodes;

public record VispanaRoot(ConfigNodes config, ContainerNodes container, ContentNodes content,
                          ApplicationPackage applicationPackage) {
}

