import Editor from "../../components/editor/editor";
import React, {useEffect, useState} from "react";
import VispanaApiClient from "../../client/vispana-api-client";
import QueryResult from "../../components/query-result/query-result";
import {v4 as uuidv4} from 'uuid';
import {Tooltip} from "react-tooltip";

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

    function addTrace() {
        try {
            const parsed = JSON.parse(query)
            if ("trace" in parsed) {
                return // don't overwrite if it's already there
            }
            parsed["tracelevel"] = 5
            parsed["trace"] = {
                "explainLevel": 1,
                "timestamps": true
            }
            setQuery(JSON.stringify(parsed, null, 2))
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
        <Editor query={query}
                setQuery={setQuery}
                handleRunQuery={runQuery}
                handleFormatQuery={prettifyJsonQuery}/>
        <div className="form-control mb-2 flex flex-row pt-1 justify-end min-w-full">
            <a type="button"
                className="btn bg-standout-blue text-yellow-400 w-13 text-center border-none outline-none mr-1"
                data-tooltip-id="vispana-tooltip"
                data-tooltip-content="Query reference"
                data-tooltip-place="top"
                target="_blank"
                href={"https://docs.vespa.ai/en/reference/query-api-reference.html"}>
                <i className={"text-xs fas fa-question pl-1 pr-1" } />
            </a>
            <button type="button"
                className="btn bg-standout-blue text-yellow-400 w-13 text-center border-none outline-none mr-1"
                data-tooltip-id="vispana-tooltip"
                data-tooltip-content="Format Query (Cmd+Opt+L)"
                data-tooltip-place="top"
                onClick={prettifyJsonQuery}>
                <i className="fas fa-code "/>
            </button>
            <button type="button"
                className="btn bg-standout-blue text-yellow-400 w-13 text-center border-none outline-none mr-1"
                data-tooltip-id="vispana-tooltip"
                data-tooltip-content="Add Trace"
                data-tooltip-place="top"
                onClick={addTrace}>
                <i className="fas fa-stopwatch pl-1 pr-1"/>
            </button>
            <button type="button"
                    className="btn bg-standout-blue text-yellow-400 w-32 btn-blue border-none outline-none"
                    data-tooltip-id="vispana-tooltip"
                    data-tooltip-content="Query (Cmd+Enter)"
                    data-tooltip-place="top"
                    onClick={handleClick}>
                    <i className={"text-xs fas fa-play pr-2"}> </i>
                    <span className="uppercase">Query</span>
            </button>
        </div>

        {showResults && <div className={"min-w-full"}>
            <QueryResult key="query"
                         query={query}
                         defaultPageSize={10}
                         containerUrl={containerUrl}
                         schema={schema}
                         render={showResults}
                         refreshQuery={refreshQuery}
                         vispanaClient={vispanaClient}
                         useTabs={true}/>
        </div>}
        <Tooltip id="vispana-tooltip" />
    </div>
}

export function defaultQuery(schema) {
    return JSON.stringify({
        yql: `SELECT * from ${schema} where true` }, null, 2);
}

export default Query
