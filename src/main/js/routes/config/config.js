// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import {useOutletContext} from "react-router-dom";
import TabView from "../../components/tabs/tab-view";
import SimpleGrid from "../../components/simple-grid/simple-grid";
import SimpleGridRow from "../../components/simple-grid/simple-grid-row";

function Config() {
    const {vespaState} = useOutletContext();

    const configurationNodes = vespaState
        .state
        .configs
        .configurationNodes;

    const tabs = Object.keys(configurationNodes)
        .map(configCluster => {
            const configNodes = configurationNodes[configCluster]
            return {
                "header": configCluster,
                "content": <SimpleGrid header="Config nodes">
                    {configNodes
                        .map(node => {
                            return <SimpleGridRow key={node.id} data={node}/>
                        })}
                </SimpleGrid>
            }
        })

    return (
        <>
            <TabView tabs={tabs}></TabView>
        </>
    );
}

export default Config;
