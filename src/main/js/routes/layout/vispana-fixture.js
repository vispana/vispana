export default function vispanaFixture() {
    return {
        "configs": {
        "configurationNodes": {
            "admin": [
                {
                    "name": "node1",
                    "host": {
                        "hostname": "vespa-config-0.vespa.sparse-suggestions.svc.cluster.local",
                        "port": 19071
                    },
                    "processesStatus": {
                        "vespa.container-clustercontroller": "DOWN",
                        "vespa.config-sentinel": "DOWN",
                        "vespa.configserver": "UP",
                        "vespa.logd": "UP",
                        "vespa.metricsproxy-container": "UP",
                        "vespa.slobrok": "UP"
                    },
                    "hostMetrics": {
                        "cpuUsage": 0.2786367906108,
                        "memoryUsage": 0.578492,
                        "diskUsage": 0.852123
                    }
                },
                {
                    "name": "node2",
                    "host": {
                        "hostname": "vespa-config-1.vespa.sparse-suggestions.svc.cluster.local",
                        "port": 19071
                    },
                    "processesStatus": {
                        "vespa.container-clustercontroller": "UP",
                        "vespa.config-sentinel": "UP",
                        "vespa.configserver": "DOWN",
                        "vespa.logd": "DOWN",
                        "vespa.metricsproxy-container": "UP",
                        "vespa.slobrok": "UNKNOWN"
                    },
                    "hostMetrics": {
                        "cpuUsage": 88.2786367906108,
                        "memoryUsage": 37.8492,
                        "diskUsage": 3.852123
                    }
                }
            ],
                "admin2": [
                {
                    "name": "node3",
                    "host": {
                        "hostname": "vespa-config-2.vespa.sparse-suggestions.svc.cluster.local",
                        "port": 19071
                    },
                    "processesStatus": {
                        "vespa.container-clustercontroller": "UP",
                        "vespa.config-sentinel": "UP",
                        "vespa.configserver": "UP",
                        "vespa.logd": "UNKNOWN",
                        "vespa.metricsproxy-container": "UP",
                        "vespa.slobrok": "UNKNOWN"
                    },
                    "hostMetrics": {
                        "cpuUsage": 50.2786367906108,
                        "memoryUsage": 37.8492,
                        "diskUsage": 3.852123
                    }
                }
            ]
        }
    },
        "containers": {
        "containerNodes": {
            "feed": [
                {
                    "name": "node1",
                    "host": {
                        "hostname": "vespa-container-0.vespa.sparse-suggestions.svc.cluster.local",
                        "port": 19071
                    },
                    "processesStatus": {
                        "vespa.config-sentinel": "DOWN",
                        "vespa.container": "UP",
                        "vespa.logd": "UNKNOWN",
                        "vespa.metricsproxy-container": "UP"
                    },
                    "hostMetrics": {
                        "cpuUsage": 0.2786367906108,
                        "memoryUsage": 0.578492,
                        "diskUsage": 0.852123
                    }
                },
                {
                    "name": "node2",
                    "host": {
                        "hostname": "vespa-container-1.vespa.sparse-suggestions.svc.cluster.local",
                        "port": 19071
                    },
                    "processesStatus": {
                        "vespa.config-sentinel": "UP",
                        "vespa.container": "UP",
                        "vespa.logd": "UNKNOWN",
                        "vespa.metricsproxy-container": "UP"
                    },
                    "hostMetrics": {
                        "cpuUsage": 88.2786367906108,
                        "memoryUsage": 37.8492,
                        "diskUsage": 3.852123
                    }
                }
            ],
                "query": [
                {
                    "name": "node3",
                    "host": {
                        "hostname": "vespa-container-2.vespa.sparse-suggestions.svc.cluster.local",
                        "port": 19071
                    },
                    "processesStatus": {
                        "vespa.config-sentinel": "UP",
                        "vespa.container": "UP",
                        "vespa.logd": "DOWN",
                        "vespa.metricsproxy-container": "UNKNOWN"
                    },
                    "hostMetrics": {
                        "cpuUsage": 50.2786367906108,
                        "memoryUsage": 37.8492,
                        "diskUsage": 3.852123
                    }
                }
            ]
        }
    },
        "contentNodes": {
        "contentNodes": {
            "content": {}
        }
    },
        "applicationPackage": {}
    }
}