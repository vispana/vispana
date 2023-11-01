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
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "UP",
                                "vespa.configserver": "UP",
                                "vespa.config-sentinel": "DOWN",
                                "vespa.container-clustercontroller": "DOWN",
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
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "DOWN",
                                "vespa.configserver": "DOWN",
                                "vespa.config-sentinel": "UP",
                                "vespa.container-clustercontroller": "UP",
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
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "UNKNOWN",
                                "vespa.configserver": "UP",
                                "vespa.config-sentinel": "UP",
                                "vespa.container-clustercontroller": "UP",
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
                                "vespa.config-sentinel": "DOWN",
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "UNKNOWN",
                                "vespa.container": "UP"
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
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "UNKNOWN",
                                "vespa.container": "UP"
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
                                "vespa.config-sentinel": "UP",
                                "vespa.metricsproxy-container": "UNKNOWN",
                                "vespa.logd": "DOWN",
                                "vespa.container": "UP"
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
                    "contentData": [
                        {
                            "schema": {
                                "schemaName": "artist20230411",
                                "schemaContent": "schema artist20230411 {}"
                            },
                            "schemaDocCountPerGroup": [
                                {
                                    "group": "0",
                                    "documents": 49321345
                                },
                                {
                                    "group": "1",
                                    "documents": 49321341
                                }
                            ],
                            "maxDocPerGroup": 49321345
                        },
                        {
                            "schema": {
                                "schemaName": "suggestion20231017",
                                "schemaContent": "schema suggestion20231017 {}"
                            },
                            "schemaDocCountPerGroup": [
                                {
                                    "group": "0",
                                    "documents": 100
                                },
                                {
                                    "group": "1",
                                    "documents": 1231
                                }
                            ],
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
                                "vespa.config-sentinel": "DOWN",
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "UNKNOWN",
                                "vespa.container": "UP"
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
                                "vespa.config-sentinel": "UP",
                                "vespa.metricsproxy-container": "UP",
                                "vespa.logd": "UNKNOWN",
                                "vespa.container": "UP"
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
                    "contentData": [
                        {
                            "schema": {
                                "schemaName": "artist20230411",
                                "schemaContent": "schema artist20230411 {}"
                            },
                            "schemaDocCountPerGroup": [
                                {
                                    "group": "0",
                                    "documents": 3
                                }
                            ],
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
                                "vespa.config-sentinel": "UP",
                                "vespa.metricsproxy-container": "UNKNOWN",
                                "vespa.logd": "DOWN",
                                "vespa.container": "UP"
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
