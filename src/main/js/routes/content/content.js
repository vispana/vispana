// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import {useOutletContext} from "react-router-dom";
import SimpleGrid from "../../components/simple-grid/simple-grid";
import SimpleGridRow from "../../components/simple-grid/simple-grid-row";
import TabView from "../../components/tabs/tab-view";

function Content() {
    const {vespaState} = useOutletContext();

    const tabs = vespaState
        .state
        .content
        .clusters
        .map(cluster => (
            {
                "header": cluster.name,
                "content":
                    <>
                        {renderOverview(cluster.overview)}
                        {renderSchemas(cluster.storedData)}
                        {renderGrid(cluster.nodes)}
                    </>
            }
        ))

    return (<TabView tabs={tabs}></TabView>);


    function renderOverview(overview) {
        return <div className="flex-auto mt-6">
            <div style={{minWidth: "200px"}}>
                <div className="w-full max-w-sm text-center bg-standout-blue rounded-md shadow-md border border-1 "
                     style={{padding: "1.0rem", borderColor: "#26324a"}}>
                    <div className="text-yellow-400">
                        Overview
                    </div>
                    <div>
                        <p className="mt-2 text-xs text-gray-200">
                            <span>Partition groups: </span> <span className="text-gray-400">{overview.partitionGroups}</span>
                            {' | '}
                            <span>Searchable copies: </span> <span className="text-gray-400">{overview.searchableCopies}</span>
                            {' | '}
                            <span>Redundancy: </span> <span className="text-gray-400">{overview.redundancy}</span>
                        </p>
                        <p className="mt-2 text-xs text-gray-200">
                            <span className="font-extrabold">Groups: </span>
                            <span className="text-gray-400">
                                { Object
                                    .keys(overview.groupNodeCount)
                                    .map((groupKey, index, array) => {
                                        const count = overview.groupNodeCount[groupKey]
                                        return (
                                            <span key={index}>
                                                <span className="text-gray-200">{groupKey}</span>
                                                {' '}
                                                <span className="italic">({count})</span>
                                                {(index < array.length -1 ) ? ' | ' : ""}
                                            </span>
                                        )
                                    })}
                          </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>;
    }

    function renderSchemas(storedData) {
        return (
            <div className="w-full overflow-x-auto md:mt-4 mt-6 pb-6">
                <div className="flex w-full h-full" style={{height: "100%"}}>
                    {storedData
                    .map((data, index) => {
                        return (
                            <div key={index} className="flex-grow flex-wrap" style={{minWidth: "200px", marginRight: "0.75rem"}}>
                                <div className="flex flex-col justify-center w-full max-w-sm text-center bg-standout-blue rounded-md shadow-md border border-1 border-standout-blue" style={{height: "100%", padding: "1.0rem", borderColor: "#26324a"}}>
                                    <div className="text-yellow-400">
                                        {data.schema.schemaName}
                                    </div>

                                    <div>
                                        <p className="mt-2 text-xs">
                                            <span className="text-white">Documents: </span>
                                            <button className="text-blue-400 underline">
                                                {data.maxDocPerGroup}
                                            </button>
                                        </p>
                                    </div>
                                    <div id="modal-content-artist20230411">
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    function renderGrid(contentNodes) {
        return <SimpleGrid header="Content nodes" hasDistributionKey={true}>
            {contentNodes.map(node => (
                <SimpleGridRow key={node.name} data={node} hasDistributionKey={true}/>))}
        </SimpleGrid>;
    }
}

export default Content;
