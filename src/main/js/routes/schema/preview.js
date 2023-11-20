import React, {useEffect, useState} from "react";
import QueryResult from "../../components/query-result/query-result";
import VispanaApiClient from "../../client/vispana-api-client";
import {defaultQuery} from "./query";
import {v4 as uuidv4} from "uuid";

function Preview({containerUrl, schema}) {
    const vispanaClient = new VispanaApiClient()
    const [query, setQuery] = useState(defaultQuery(schema))
    const [refreshQuery, setRefreshQuery] = useState(uuidv4())

    useEffect(() => {
        setQuery(defaultQuery(schema))
        setRefreshQuery(uuidv4())
    }, [schema])

    return (<div>
        <QueryResult key={"preview"}
                     containerUrl={containerUrl}
                     vispanaClient={vispanaClient}
                     schema={schema}
                     showResults={true}
                     refreshQuery={refreshQuery}
                     query={query}/>
    </div>)
}

export default Preview;