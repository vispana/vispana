package com.vispana.model;

public enum Status{
    UP,
    DOWN,
    UNKNOWN;

    static Status parseFrom(String status) {
        return switch (status.toLowerCase()){
           case "up" -> UP;
           case "down" -> DOWN;
            default -> UNKNOWN;
        };
    }
}
