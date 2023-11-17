import React, {useEffect, useState} from 'react'
import DataTable, {createTheme} from 'react-data-table-component';
import {androidstudio} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import Loading from "../../routes/loading/loading";
import VispanaError from "../../routes/error/vispana-error";
import {useRevalidator} from "react-router-dom";

function QueryResult({containerUrl, vispanaClient, query, showResults, schema, refreshQuery, defaultPageSize = 15}) {
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
        context: {
            text: '#facc15',
        },
        divider: {
            default: 'rgb(20 27 45 / var(--tw-bg-opacity))',
        },
    });
    const revalidator = useRevalidator();

    // data state
    const [data, setData] = useState({columns: [], content: []});
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

    async function postQuery(offset, perPage) {
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

            const gridData = processResult(vespaState);
            setData(gridData);

            setError({
                hasError: false,
                error: undefined
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
        load();
    }, [schema, showResults, perPage, page]);

    useEffect(() => {
        setError({
            hasError: false,
            error: ""
        })
        load();
    }, [refreshQuery]);

    return (
        <>
            {!error.hasError && <DataTable
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
            />}
            {error.hasError && (<VispanaError showLogo={false} errorMessage={{
                title: "Failed to execute the query",
                description: error.error
            }}/>)}
        </>
    )
}

function processResult(previewResults) {
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
    if (!previewResults || !previewResults.root.fields.totalCount) {
        return {
            columns: [],
            content: []
        }
    }
    const children = previewResults.root.children;
    const resultFields = children.flatMap(child => Object.keys(child.fields));
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
    const data = children.map(child => child.fields)
    return {
        columns: columns,
        content: data
    }
}

const ExpandedComponent = ({data}) => {
    return <SyntaxHighlighter language="json" style={androidstudio}>
        {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
};

export default QueryResult;
