// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import {useOutletContext} from "react-router-dom";
import SimpleGrid from "../../components/simple-grid/simple-grid";
import SimpleGridRow from "../../components/simple-grid/simple-grid-row";
import TabView from "../../components/tabs/tab-view";

function Container() {
    const {vespaState} = useOutletContext();

    const tabs = vespaState
        .state
        .container
        .clusters
        .map(cluster => {
            return {
                "header": cluster.name,
                "content":
                    <SimpleGrid header="Container nodes">
                        { cluster.nodes.map(node => (<SimpleGridRow key={node.name} data={node}/>)) }
                    </SimpleGrid>
            }
        })

    return (
        <>
            <TabView tabs={tabs}></TabView>
        </>
    );
}

export default Container;
