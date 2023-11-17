package com.vispana.vespa.state.helpers;

import com.vispana.api.model.HostMetrics;
import com.vispana.client.vespa.model.MetricsNode;

public class SystemMetrics {
  public static HostMetrics systemMetrics(MetricsNode hostMetrics) {
    var cpuUtil = 0d;
    var memoryUsage = 0d;
    var diskUsage = 0d;

    for (var services : hostMetrics.getServices()) {
      for (var metric : services.getMetrics()) {
        var values = metric.getValues();
        if (values.getContentProtonResourceUsageDiskAverage() != null) {
          diskUsage += values.getContentProtonResourceUsageDiskAverage();
        }
        if (values.getContentProtonResourceUsageMemoryAverage() != null) {
          memoryUsage += values.getContentProtonResourceUsageMemoryAverage();
        }
        if (values.getCpuUtil() != null) {
          cpuUtil += values.getCpuUtil();
        }
      }
    }

    return new HostMetrics(cpuUtil, memoryUsage * 100, diskUsage * 100);
  }
}
