import React, {useState} from 'react'
import {useSearchParams} from "react-router-dom";

function Configuration({loadedVespaState}) {
    function clusterRoutingConfigurationMap() {
        const initialState = new Map();
        loadedVespaState
            .container
            .clusters
            .forEach(cluster => {
                // const clusterName = cluster.name
                const routingSearchParameterName = routingSearchParamName(cluster.name)
                if (searchParams.has(routingSearchParameterName)) {
                    initialState.set(cluster.name, searchParams.get(routingSearchParameterName))
                } else {
                    initialState.set(cluster.name, '')
                }
            })
        return initialState
    }

    function handleChange(event) {
        const clusterName = event.target.id
        const value = event.target.value
        const newRoutingConf = new Map(routingConfigurationState)
        newRoutingConf.set(clusterName, value)
        setRoutingConfigurationState(newRoutingConf)
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const initialState = clusterRoutingConfigurationMap();
    const [routingConfigurationState, setRoutingConfigurationState] = useState(initialState)

    return <dialog id="vispana-config-modal" className="modal">
        <div className="modal-box text-center bg-standout-blue border"
             style={{borderColor: "#26324a"}}>
            <form method="dialog">
                <button id="close"
                        className="text-gray-400 text-sm absolute right-4 top-4">✕
                </button>
            </form>
            <br/>
            <div className="w-full">
                <span>Cluster routing</span>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    loadedVespaState
                        .container
                        .clusters
                        .forEach(cluster => {
                            const containerName = cluster.name;
                            const value = event.currentTarget.elements[containerName].value
                            if (value) {
                                const route = routingSearchParamName(containerName);
                                searchParams.set(route, value)
                            } else {
                                const route = routingSearchParamName(containerName);
                                searchParams.delete(route)
                            }
                        })
                    setSearchParams(searchParams)
                    document.getElementById('vispana-config-modal').close()
                }}>
                    {
                        Array.from(routingConfigurationState.entries())
                            .map(entry => {
                                const entryKey = entry[0];
                                const entryValue = entry[1];
                                return <div className="mb-1" key={entryKey}>
                                    <div className="label">
                                        <label htmlFor="cluster"
                                               className="label-text text-yellow-400">{entryKey}</label>
                                    </div>
                                    <input onChange={handleChange} type="cluster" id={entryKey}
                                           key={entryKey} value={entryValue}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                                           placeholder={`e.g., http://${entryKey}-cluster-lb/`}></input>
                                </div>
                            })
                    }

                    <div className="form-control mt-4">
                        <button className="btn btn-ghost">Save</button>
                    </div>
                </form>
            </div>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button id="modal-close">close</button>
        </form>
    </dialog>
}

export function routingSearchParamName(clusterName) {
    return 'route-' + clusterName;
}

export default Configuration
