package com.vispana.model;

import com.vispana.model.apppackage.ApplicationPackage;
import com.vispana.model.config.ConfigNodes;
import com.vispana.model.container.ContainerNodes;
import com.vispana.model.content.ContentNodes;

public record VispanaRoot(ConfigNodes config, ContainerNodes container, ContentNodes content,
                          ApplicationPackage applicationPackage) {
}

