package com.vispana.api.model;

public record VespaVersion(long major, long minor, long patch) {

  public static VespaVersion fromString(String version) {

    // Vespa use semantic versioning major.minor.patch
    var parts = version.split("\\.");
    if (parts.length != 3) {
      throw new RuntimeException(
          String.format("Failed to parse vespa semantic version: %s", version));
    }

    try {
      new VespaVersion(
          Long.parseLong(parts[0]), Long.parseLong(parts[1]), Long.parseLong(parts[2]));
    } catch (NumberFormatException e) {
      throw new RuntimeException(
          String.format("Failed to parse vespa version numbers: %s", version), e);
    }
    return new VespaVersion(
        Long.parseLong(parts[0]), Long.parseLong(parts[1]), Long.parseLong(parts[2]));
  }

  @Override
  public String toString() {
    return major + "." + minor + "." + patch;
  }
}
