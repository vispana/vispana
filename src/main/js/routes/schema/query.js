import Editor from "../../components/editor/editor";
import React, {useEffect, useState} from "react";
import VispanaApiClient from "../../client/vispana-api-client";
import QueryResult from "../../components/query-result/query-result";
import {v4 as uuidv4} from 'uuid';

function Query({containerUrl, schema}) {
    function runQuery() {
        setShowResults(true)
        setRefreshQuery(uuidv4())
    }

    function handleClick(event) {
        event.preventDefault()
        runQuery()
    }

    function prettifyJsonQuery() {
        try {
            setQuery(JSON.stringify(JSON.parse(query), null, 2))
        } catch (_) {
        }
    }

    const vispanaClient = new VispanaApiClient()
    const [query, setQuery] = useState(defaultQuery(schema))
    const [showResults, setShowResults] = useState(false)
    const [refreshQuery, setRefreshQuery] = useState(uuidv4())

    useEffect(() => {
        setQuery(defaultQuery(schema))
        setShowResults(false)
    }, [schema])

    return <div className={"min-w-full"}>
        <Editor query={query} setQuery={setQuery} handleRunQuery={runQuery}
                handleFormatQuery={prettifyJsonQuery}/>
        <div className="form-control mb-2 flex flex-row pt-1">
            <div className="tooltip tooltip-right" data-tip="Format Query (Cmd+Opt+L)">
                <button className="btn btn-ghost text-yellow-400 text-left w-32 flex justify-start"
                        onClick={prettifyJsonQuery}>
                    <i className="fas fa-code block"/>
                </button>
            </div>
            <button className="btn btn-ghost text-yellow-400 flex-grow"
                    onClick={handleClick}>
                <div className="tooltip tooltip-right w-24 capitalize" data-tip="Query (Cmd+Enter)">
                    <span className="uppercase">Query</span>
                </div>
            </button>

            <a className="text-sm underline w-32 text-right"
               target="_blank"
               href={"https://docs.vespa.ai/en/reference/query-api-reference.html"}>
                Query reference
            </a>
        </div>
        {showResults && <div className={"min-w-full"}>
            <QueryResult key="query"
                         query={query}
                         defaultPageSize={10}
                         containerUrl={containerUrl}
                         schema={schema}
                         render={showResults}
                         refreshQuery={refreshQuery}
                         vispanaClient={vispanaClient}/>
        </div>}
    </div>
}

export function defaultQuery(schema) {
    return JSON.stringify({
        yql: `SELECT * from ${schema} where true` }, null, 2);
}

export default Query
