package com.vispana.api.model.apppackage;

import com.vispana.vespa.state.helpers.JavaComponentsFilesystem;

// Application package
public record ApplicationPackage(
    String appPackageGeneration,
    String servicesContent,
    String hostsContent,
    JavaComponentsFilesystem.Filesystem javaComponentsContent) {}
