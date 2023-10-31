export default function vispanaFixture() {
    return {
        "config": {
            "clusters": [
                {
                    "name": "admin",
                    "nodes": [
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
                    ]
                },
                {
                    "name": "admin2",
                    "nodes": [
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
            ]
        },
        "container": {
            "clusters": [
                {
                    "name": "feed",
                    "nodes": [
                        {
                            "name": "node1",
                            "host": {
                                "hostname": "vespa-container-0.vespa.sparse-suggestions.svc.cluster.local",
                                "port": 19071
                            },
                            "processesStatus": {
                                "vespa.metricsproxy-container": "UP",
                                "vespa.config-sentinel": "DOWN",
                                "vespa.container": "UP",
                                "vespa.logd": "UNKNOWN"
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
                                "vespa.metricsproxy-container": "UP",
                                "vespa.config-sentinel": "UP",
                                "vespa.container": "UP",
                                "vespa.logd": "UNKNOWN"
                            },
                            "hostMetrics": {
                                "cpuUsage": 88.2786367906108,
                                "memoryUsage": 37.8492,
                                "diskUsage": 3.852123
                            }
                        }
                    ]
                },
                {
                    "name": "query",
                    "nodes": [
                        {
                            "name": "node3",
                            "host": {
                                "hostname": "vespa-container-2.vespa.sparse-suggestions.svc.cluster.local",
                                "port": 19071
                            },
                            "processesStatus": {
                                "vespa.metricsproxy-container": "UNKNOWN",
                                "vespa.config-sentinel": "UP",
                                "vespa.container": "UP",
                                "vespa.logd": "DOWN"
                            },
                            "hostMetrics": {
                                "cpuUsage": 50.2786367906108,
                                "memoryUsage": 37.8492,
                                "diskUsage": 3.852123
                            }
                        }
                    ]
                }
            ]
        },
        "content": {
            "clusters": [
                {
                    "name": "content1",
                    "overview": {
                        "partitionGroups": 2,
                        "searchableCopies": 2,
                        "redundancy": 2,
                        "groupNodeCount": {
                            "1": 2,
                            "0": 2
                        }
                    },
                    "storedData": [
                        {
                            "schema": {
                                "schemaName": "artist20230411"
                            },
                            "documentsPerGroup": {
                                "1": 15001,
                                "0": 15000
                            },
                            "maxDocPerGroup": 15001
                        },
                        {
                            "schema": {
                                "schemaName": "suggestion20231017"
                            },
                            "documentsPerGroup": {
                                "1": 1231,
                                "0": 100
                            },
                            "maxDocPerGroup": 1231
                        }
                    ],
                    "nodes": [
                        {
                            "name": "node1",
                            "host": {
                                "hostname": "vespa-content-0.vespa.sparse-suggestions.svc.cluster.local",
                                "port": 19071
                            },
                            "processesStatus": {
                                "vespa.metricsproxy-container": "UP",
                                "vespa.config-sentinel": "DOWN",
                                "vespa.container": "UP",
                                "vespa.logd": "UNKNOWN"
                            },
                            "hostMetrics": {
                                "cpuUsage": 0.2786367906108,
                                "memoryUsage": 0.578492,
                                "diskUsage": 0.852123
                            },
                            "group": {
                                "key": "0",
                                "distribution": "0"
                            }
                        },
                        {
                            "name": "node2",
                            "host": {
                                "hostname": "vespa-content-1.vespa.sparse-suggestions.svc.cluster.local",
                                "port": 19071
                            },
                            "processesStatus": {
                                "vespa.metricsproxy-container": "UP",
                                "vespa.config-sentinel": "UP",
                                "vespa.container": "UP",
                                "vespa.logd": "UNKNOWN"
                            },
                            "hostMetrics": {
                                "cpuUsage": 88.2786367906108,
                                "memoryUsage": 37.8492,
                                "diskUsage": 3.852123
                            },
                            "group": {
                                "key": "0",
                                "distribution": "1"
                            }
                        }
                    ]
                },
                {
                    "name": "content2",
                    "overview": {
                        "partitionGroups": 2,
                        "searchableCopies": 2,
                        "redundancy": 2,
                        "groupNodeCount": {
                            "0": 2
                        }
                    },
                    "storedData": [
                        {
                            "schema": {
                                "schemaName": "artist20230411"
                            },
                            "documentsPerGroup": {
                                "0": 3
                            },
                            "maxDocPerGroup": 3
                        }
                    ],
                    "nodes": [
                        {
                            "name": "node3",
                            "host": {
                                "hostname": "vespa-content-2.vespa.sparse-suggestions.svc.cluster.local",
                                "port": 19071
                            },
                            "processesStatus": {
                                "vespa.metricsproxy-container": "UNKNOWN",
                                "vespa.config-sentinel": "UP",
                                "vespa.container": "UP",
                                "vespa.logd": "DOWN"
                            },
                            "hostMetrics": {
                                "cpuUsage": 50.2786367906108,
                                "memoryUsage": 37.8492,
                                "diskUsage": 3.852123
                            },
                            "group": {
                                "key": "1",
                                "distribution": "0"
                            }
                        }
                    ]
                }
            ]
        },
        "applicationPackage": {}
    }

}
