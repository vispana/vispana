import React, {useEffect, useState} from 'react'
import DataTable, {createTheme} from 'react-data-table-component';
import {androidstudio} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import Loading from "../../routes/loading/loading";
import VispanaError from "../../routes/error/vispana-error";
import TabView from "../tabs/tab-view";

function QueryResult({containerUrl, vispanaClient, query, showResults, schema, refreshQuery, defaultPageSize = 15, useTabs = false}) {
    // customize theme
    createTheme('dark', {
        text: {
            // primary: '#facc15',
            primary: '#fff',
            secondary: '#fff',
        },
        background: {
            default: '#1f2a40',
        },
        highlightOnHover: {
            default: '#3b4f77',
            text: '#fff',
        },
        striped: {
            default: '#2c3c5a',
            text: '#fff',
        },
        context: {
            text: '#facc15',
        },
        divider: {
            default: 'rgb(20 27 45 / var(--tw-bg-opacity))',
        },
    });

    // data state
    const [data, setData] = useState({columns: [], content: [], trace: []});
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);

    // pagination state
    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(defaultPageSize);
    const [page, setPage] = useState(1);

    // error state
    const [error, setError] = useState({
        hasError: false,
        error: ""
    });

    const NoDataConst = props => {
        if (data.json && data.json.root) {
            const root = data.json.root
            if (root.coverage && root.coverage.degraded && root.coverage.degraded.timeout) {
                return <><span className="text-red-500 m-8">Vespa query timed out.</span></>
            } else {
                if (root.fields && root.fields.totalCount === 0) {
                    return <><span className="text-yellow-400 m-8">No fields returned.</span></>
                } else {
                    return <><span className="text-yellow-400 m-8">Unexpected state, please check JSON and report an issue.</span></>
                }
            }
        }

        return <><span className="text-yellow-400 m-8">There are no records to display</span></>
    }

    async function postQuery(offset, perPage) {
        try {
            const queryObject = JSON.parse(query)
            const response = await vispanaClient
              .postQuery(containerUrl, queryObject, offset, perPage)
              .then(response => {
                  if (response.status && response.status !== 200) {
                      const error = response.message ? response.message : "Failed to execute the query"
                      return {
                          success: undefined,
                          error: error
                      }
                  } else {
                      return {
                          success: response,
                          error: undefined
                      }
                  }
              })
              .catch(error => {
                  return {
                      success: undefined,
                      error: error.message
                  }
              })

            if (response.error) {
                setError({
                    hasError: true,
                    error: response.error
                })
            } else {
                const vespaState = response.success;
                setTotalRows(vespaState.root.fields.totalCount);

                const resultData = processResult(vespaState);
                setData(resultData);

                setError({
                    hasError: false,
                    error: undefined
                })
            }
        } catch (exception) {
            setError({
                hasError: true,
                error: exception.message
            })
        }

    }

    const load = async () => {
        setLoading(true);
        await postQuery(offset, perPage);
        setLoading(false);
    };

    const handlePageChange = newPage => {
        if (newPage === page) {
            return;
        }
        const offset = (newPage - 1) * perPage
        setPage(newPage)
        setOffset(offset)
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        if (newPerPage === perPage) {
            return;
        }
        setPerPage(newPerPage);
    };

    useEffect(() => {
        setPage(1)
        setPerPage(defaultPageSize)
        setError({
            hasError: false,
              error: ""
        })
    }, [schema]);

    useEffect(() => {
        load();
    }, [showResults, perPage, page]);

    useEffect(() => {
        setError({
            hasError: false,
            error: ""
        })
        load();
    }, [refreshQuery]);

    if (error.hasError) {
        return (
            <VispanaError showLogo={false} errorMessage={{
                title: "Failed to execute the query",
                description: error.error
            }}/>
        )
    }

    const results = (
        <DataTable
            theme="dark"
            customStyles={{
                head: {
                    style: {
                        color: '#facc15'
                    }
                }
            }}
            columns={data.columns}
            data={data.content}
            fixedHeader
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            progressPending={loading}
            progressComponent={<Loading centralize={false}/>}
            pagination
            paginationPerPage={defaultPageSize}
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            responsive
            striped
            highlightOnHover
            noDataComponent={<NoDataConst/>}
        />
    )

    if (!useTabs) {
        return results
    }

    const tabs = [
        {
            "header": "Results",
            "content": results
        },
        {
            "header": "JSON response",
            "content": (<SyntaxHighlighter language="json" style={androidstudio}>
                {JSON.stringify(data.json, null, 2)}
            </SyntaxHighlighter>)
        }
    ]

    if (data && data.trace && data.trace.length > 0) {
        tabs.push(
            {
                "header": "Trace",
                "content": (
                    <SyntaxHighlighter language="json" style={androidstudio}>
                        {JSON.stringify(data.trace, null, 2)}
                    </SyntaxHighlighter>
                )
            }
        )
    }

    return (
        <TabView tabs={tabs}/>
    )
}

function processResult(result) {
    function extractData(rawData) {
        if (rawData === null || rawData === undefined) {
            return null;
        } else if (Array.isArray(rawData)) {
            return JSON.stringify(rawData)
        } else if (typeof rawData === "object") {
            return JSON.stringify(rawData)
        } else {
            return rawData.toString()
        }
    }

    // if empty result, just skip
    if (!result || !result.root.fields.totalCount) {
        return {
            columns: [],
            content: [],
            trace: [],
            json: result
        }
    }

    const children = result.root.children ? result.root.children : [];

    const resultFields = children.flatMap(child => Object.keys(child.fields));
    resultFields.push("relevance")

    const columns = [...new Set(resultFields)]
        .map(column => (
            {
                name: column,
                maxWidth: "300px",
                minWidth: "50px",
                selector: row => {
                    const rawData = row[column]
                    return extractData(rawData)
                },
            }))

    const data = children.map(child => {
        const fields = child.fields;
        fields.relevance = child.relevance
        return fields
    })

    let trace = []
    if ("trace" in result) {
        trace = result.trace.children
        result["trace"] = "...see trace tab..."
    }

    return {
        columns: columns,
        content: data,
        trace: trace,
        json: result
    }
}

const ExpandedComponent = ({data}) => {
    return <SyntaxHighlighter language="json" style={androidstudio}>
        {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
};

export default QueryResult;
