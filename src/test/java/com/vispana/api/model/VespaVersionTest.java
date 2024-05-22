package com.vispana.api.model;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class VespaVersionTest {

  @Test
  void fromString() {
    var version = VespaVersion.fromString("7.1.0");
    assertEquals(7, version.major());
    assertEquals(1, version.minor());
    assertEquals(0, version.patch());
    assertEquals("7.1.0", version.toString());
  }

  @Test
  void fromStringThrowsOnInvalidVersion() {
    assertThrows(RuntimeException.class, () -> VespaVersion.fromString("7.1"));
    assertThrows(RuntimeException.class, () -> VespaVersion.fromString("8.323.a"));
  }
}
