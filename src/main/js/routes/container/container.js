import React from 'react'
import {useOutletContext} from "react-router-dom";

import TabView from "../../components/tabs/tab-view";
import SimpleGrid from "../../components/simple-grid/simple-grid";
import SimpleGridRow from "../../components/simple-grid/simple-grid-row";

function Container() {
    const vespaState = useOutletContext();

    const tabs = vespaState
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

    return (<TabView tabs={tabs}></TabView>);
}

export default Container;
