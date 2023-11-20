import Editor from "../../components/editor/editor";
import React, {useState} from "react";
import VispanaApiClient from "../../client/vispana-api-client";
import QueryResult from "../../components/query-result/query-result";
import { v4 as uuidv4 } from 'uuid';

function Query({containerUrl, schema}) {
    function handleClick(event) {
        event.preventDefault()
        setShowResults(true)
        setRefreshQuery(uuidv4())
    }

    const vispanaClient = new VispanaApiClient()
    const defaultQuery = JSON.stringify({
        yql: `SELECT *from ${schema} where true`,
        hits: 30
    }, null, 2)

    const [query, setQuery] = useState(defaultQuery)
    const [showResults, setShowResults] = useState(false)
    const [refreshQuery, setRefreshQuery] = useState(uuidv4())

    return <div className={"min-w-full"}>
        <form>
            <Editor query={query} setQuery={setQuery}/>
            <div className="form-control mb-2">
                <div className={"min-w-full text-right"}>
                    <a className={"text-sm underline"}
                       target="_blank"
                       href={"https://docs.vespa.ai/en/reference/query-api-reference.html"}>
                        Query reference
                    </a>
                </div>
                <button className="btn btn-ghost text-yellow-400" type="submit" onClick={handleClick}>
                    Query
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
                             vispanaClient={vispanaClient}/>
            </div>}
        </form>
    </div>
}

export default Query
