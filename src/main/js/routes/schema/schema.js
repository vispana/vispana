import React from 'react'
import {useOutletContext, useParams} from "react-router-dom";
import TabView from "../../components/tabs/tab-view";
import Preview from "./preview";
import Query from "./query";

function Schema() {
    const vespaState = useOutletContext()
    const params = useParams()
    const containerUrl = getQueryableContainer(vespaState)
    const schema = params.schema

    return (<>
        <TabView tabs={[
            {
                "header": "Query",
                "content": <Query containerUrl={containerUrl} schema={schema}/>
            },
            {
                "header": "Data preview",
                "content": <Preview containerUrl={containerUrl} schema={schema}/>
            },]} />
    </>)

    /* finds a valid container to issue the query */
    function getQueryableContainer(vespaState) {
        const clusters = vespaState
            .container
            .clusters
            .filter(cluster => cluster.canSearch === true)

        if (clusters && clusters.length > 0 && clusters[0].nodes && clusters[0].nodes.length > 0) {
            return clusters[0].route
        } else {
            return ""
        }
    }
}


export default Schema;
