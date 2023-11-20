import React from "react";
import QueryResult from "../../components/query-result/query-result";
import VispanaApiClient from "../../client/vispana-api-client";

function Preview({containerUrl, schema}) {
    const vispanaClient = new VispanaApiClient()

    const query = JSON.stringify({
        yql: `SELECT * from ${schema} where true`
    }, null, 2)

    return (<div>
        <QueryResult key={"preview"}
                     containerUrl={containerUrl}
                     vispanaClient={vispanaClient}
                     schema={schema}
                     showResults={true}
                     query={query}/>
    </div>)
}

export default Preview;