export default function schema() {
    return {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "yql": {type: "string", "minLength": 1},
            "hits": {type: "integer", minimum: 0},
            "offset": {type: "integer", minimum: 0},
            "queryProfile": {type: "string", minLength: 1},
            "groupingSessionCache": {type: "boolean"},
            "searchChain": {type: "string", minLength: 1},
            "timeout": {type: "string", minLength: 1},
            "model": {
                type: 'object',
                properties: {
                    "defaultIndex": {type: 'string'},
                    "encoding": {type: 'string'},
                    "filter": {type: 'string'},
                    "locale": {type: 'string'},
                    "language": {type: 'string'},
                    "queryString": {type: 'string'},
                    "restrict": {type: 'string'},
                    "searchPath": {type: 'string'},
                    "sources": {type: 'string'},
                    "type": {type: 'string'},
                },
            },
            "ranking": {
                type: ['object', 'string'],
                properties: {
                    "location": {type: 'string'},
                    "features": {
                        type: 'object',
                        properties: {},
                        additionalProperties: true
                    },
                    "listFeatures": {type: 'boolean'},
                    "profile": {type: 'string'},
                    "properties": {
                        type: 'object',
                        properties: {},
                        additionalProperties: true
                    },
                    "softtimeout": {
                        type: 'object',
                        properties: {
                            "enable": {type: 'boolean'},
                            "factor": {type: 'number', minimum: 0, maximum: 1},
                        },
                    },
                },
                "sorting": {type: 'string'},
                "freshness": {type: 'string'},
                "queryCache": {type: 'boolean'},
                "rerankCount": {type: 'integer', minimum: 0},
                "matching": {
                    type: 'object',
                    properties: {
                        "numThreadsPerSearch": {type: 'integer', minimum: 0},
                        "minHitsPerThread": {type: 'integer', minimum: 0},
                        "numSearchPartitions": {type: 'integer', minimum: 0},
                        "termwiseLimit": {type: 'number', minimum: 0, maximum: 1},
                        "postFilterThreshold": {type: 'number', minimum: 0, maximum: 1},
                        "approximateThreshold": {type: 'number', minimum: 0, maximum: 1},
                    },
                },
                "matchPhase": {
                    type: 'object',
                    properties: {
                        "attribute": {type: 'string'},
                        "maxHits": {type: 'integer'},
                        "ascending": {type: 'boolean'},
                        "diversity": {
                            type: 'object',
                            properties: {
                                "attribute": {type: 'string'},
                                "minGroups": {type: 'integer'},
                            }
                        }
                    }
                }
            },
            "collapsesize": {type: 'integer', minimum: 1},
            "collapsefield": {type: 'string'},
            "collapse": {
                type: 'object',
                properties: {
                    "summary": {type: 'string'},
                },
            },
            "grouping": {
                type: 'object',
                properties: {
                    "defaultMaxGroups": {type: 'integer', minimum: -1},
                    "defaultMaxHits": {type: 'integer', minimum: -1},
                    "globalMaxGroups": {type: 'integer', minimum: -1},
                    "defaultPrecisionFactor": {type: 'number', minimum: 0},
                },
            },
            "presentation": {
                type: 'object',
                properties: {
                    "bolding": {type: 'boolean'},
                    "format": {type: 'string'},
                    "template": {type: 'string'},
                    "summary": {type: 'string'},
                    "timing": {type: 'boolean'},
                },
            },
            "trace": {
                type: 'object',
                properties: {
                    "level": {type: 'integer', minimum: 1},
                    "explainLevel": {type: 'integer', minimum: 1},
                    "profileDepth": {type: 'integer', minimum: 1},
                    "timestamps": {type: 'boolean'},
                    "query": {type: 'boolean'},
                },
            },
            "rules": {
                type: 'object',
                properties: {
                    "off": {type: 'boolean'},
                    "rulebase": {type: 'string'},
                },
            },
            "tracelevel": {type: 'integer', minimum: 0},
            "dispatch": {
                type: 'object',
                properties: {
                    "topKProbability": {type: 'number', minimum: 0, maximum: 1},
                },
            },
            "recall": {type: 'string'},
            "user": {type: 'string'},
            "hitcountestimate": {type: 'boolean'},
            "metrics": {
                type: 'object',
                properties: {
                    "ignore": {type: 'boolean'},
                },
            },
            "weakAnd": {
                type: 'object',
                properties: {
                    "replace": {type: 'boolean'},
                },
            },
            "wand": {
                type: 'object',
                properties: {
                    "hits": {type: 'integer'},
                },
            },
            "sorting": {
                type: 'object',
                properties: {
                    "degrading": {type: 'boolean'},
                },
            },
            "streaming": {
                type: 'object',
                properties: {
                    "userid": {type: 'integer'},
                    "groupname": {type: 'string'},
                    "selection": {type: 'string'},
                    "priority": {type: 'string'},
                    "maxbucketspervisitor": {type: 'integer'},
                },
            },

            // extra
            "summary": {type: 'string'}
        },
        "required": [
            "yql",
        ],
        "additionalProperties": true
    }
}
