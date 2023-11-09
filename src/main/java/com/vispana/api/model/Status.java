package com.vispana.api.model;

public enum Status {
  UP,
  DOWN,
  UNKNOWN;

  public static Status parseFrom(String status) {
    return switch (status.toLowerCase()) {
      case "up" -> UP;
      case "down" -> DOWN;
      default -> UNKNOWN;
    };
  }
}
