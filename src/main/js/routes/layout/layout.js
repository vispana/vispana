import React, {Suspense, useEffect, useState} from 'react'
import {
    Await,
    defer,
    NavLink,
    Outlet,
    useLoaderData,
    useRevalidator,
    useSearchParams
} from "react-router-dom";
import VispanaApiClient from "../../client/vispana-api-client";
import Loading from "../loading/loading";
import {logoPath} from "../index";
import Accordion, {accordionHeaderController} from "../../components/accordion/accordion";
import Configuration, {routingSearchParamName} from "./configuration";
import VispanaError from "../error/vispana-error";

function Layout() {
    const loaderData = useLoaderData();
    const revalidator = useRevalidator();
    const [searchParams, setSearchParams] = useSearchParams();
    // refresh interval state
    const refreshIconClass = "fas fa-sync-alt"
    const [refreshInterval, setRefreshInterval] = useState(-1);
    const [refreshIcon, setRefreshIcon] = useState(refreshIconClass);

    // Code below sets the expected effects once refreshes changes
    useEffect(() => {
        // only schedule refreshes if interval is bigger than 0
        if (refreshInterval > 0) {
            const interval = setInterval(() => {
                if (document.visibilityState === "visible") {
                    revalidator.revalidate();
                }
            }, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    useEffect(() => {
        if (revalidator.state === "idle") {
            setRefreshIcon(refreshIconClass)
        } else {
            setRefreshIcon(refreshIconClass + " fa-spin text-yellow-400")
        }
    }, [revalidator.state]);

    return (<>
        <Suspense fallback={<Loading/>}>
            <Await
                resolve={loaderData.vespaState}
                errorElement={<VispanaError/>}>
                {(loadedVespaState) => (
                    <main role="main" className="h-screen flex flex-row flex-wrap">
                        <div id="sideBar"
                             className="relative h-screen  flex flex-col flex-wrap p-6 flex-none w-56 md:-ml-64 md:fixed md:top-0 md:z-30 md:h-screen md:shadow-xl animated faster bg-standout-blue">
                            <div className="flex flex-col">
                                <div
                                    className="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                                    <div
                                        className="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400 overflow-hidden">
                                        <a href="/">
                                            <img alt="" src={logoPath()}
                                                 className="icon icon-tabler icon-tabler-stack"/>
                                        </a>
                                    </div>
                                </div>
                                <NavLink to={`config?${searchParams.toString()}`}
                                         className={navLinkStyle()}>
                                    <i className="fas fa-project-diagram text-xs mr-2"></i>
                                    Config
                                </NavLink>

                                <NavLink to={`container?${searchParams.toString()}`}
                                         className={navLinkStyle()}>
                                    <i className="fas fa-microchip text-xs mr-2"></i>
                                    Container
                                </NavLink>

                                <NavLink to={`content?${searchParams.toString()}`}
                                         className={navLinkStyle()}>
                                    <i className="fas fa-hdd text-xs mr-2"></i>
                                    Content
                                </NavLink>

                                <NavLink to={`apppackage?${searchParams.toString()}`}
                                         className={navLinkStyle()}>
                                    <i className="fas fa-archive text-xs mr-2"></i>
                                    Application Package
                                </NavLink>

                                <Accordion controllerElement={accordionHeaderController}
                                           contentDescription="schemas">
                                    {loadedVespaState
                                        .content
                                        .clusters
                                        .flatMap(cluster => {
                                            return cluster
                                                .contentData
                                                .map(contentData => {
                                                    const schema = contentData.schema.schemaName
                                                    return (<NavLink key={schema}
                                                                     to={`schema/${schema}?${searchParams.toString()}`}
                                                                     className={navLinkStyle()}>
                                                        {schema}
                                                    </NavLink>)
                                                })
                                        })
                                    }
                                </Accordion>

                            </div>
                        </div>
                        <div className="flex-1 h-screen p-6 md:mt-16 overflow-x-auto w-full">
                            <div>
                                <div className="space-x-1 w-full">
                                    <div className="text-right font-flow"
                                         style={{textAlign: "right"}}>

                                        <a className="text-xs btn btn-square btn-sm bg-standout-blue border-0 hover:bg-standout-blue hover:border-0 active:border-0"
                                           style={{marginRight: '2px'}} onClick={() => {
                                            document.getElementById('vispana-config-modal').showModal()
                                        }}>
                                            <i className="fas fa-cog"></i>
                                        </a>
                                        <a className="text-xs btn btn-square btn-sm bg-standout-blue border-0 hover:bg-standout-blue hover:border-0 active:border-0"
                                           style={{marginRight: '2px'}} onClick={() => {
                                            revalidator.revalidate()
                                        }}>
                                            <i className={refreshIcon}></i>
                                        </a>
                                        <select
                                            className="select select-sm w-40 max-w-xs bg-standout-blue text-xs focus:ring-0"
                                            id="form_interval" name="refresh_interval[interval]"
                                            defaultValue={-1} onChange={(event) => {
                                            setRefreshInterval(Number(event.target.value))
                                        }}>
                                            <option value="-1">Off</option>
                                            <option value="15000">15s</option>
                                            <option value="30000">30s</option>
                                            <option value="60000">1m</option>
                                            <option value="300000">5m</option>
                                            <option value="600000">10m</option>
                                            <option value="1800000">30m</option>
                                            <option value="3600000">1h</option>
                                        </select>

                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 max-h-full bg-darkest-blue">
                                <div className="-my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
                                    <Outlet context={loadedVespaState}/>
                                </div>
                            </div>
                        </div>
                        <Configuration loadedVespaState={loadedVespaState}></Configuration>
                    </main>
                )}
            </Await>
        </Suspense>
    </>);

    function navLinkStyle() {
        return ({isActive}) => {
            if (isActive) {
                return "mt-3 capitalize font-medium text-sm transition ease-in-out duration-100" +
                    " text-yellow-400"
            } else {
                return "mt-3 capitalize font-medium text-sm hover:text-white transition" +
                    " ease-in-out duration-500 text-gray-300"
            }
        };
    }
}

export async function loader({request}) {
    const url = new URL(request.url);
    const configHost = url.searchParams.get("config_host");
    const vespaState = getVespaState(configHost)
        .then(vespaState => {
            vespaState
                .container
                .clusters
                .forEach(cluster => {
                    const containerName = cluster.name;
                    // either use the route from the url or the first node in the cluster
                    if (url.searchParams.has(routingSearchParamName(containerName))) {
                        cluster.route = url.searchParams.get(routingSearchParamName(containerName))
                    } else {
                        const nodeHost = cluster.nodes[0].host
                        cluster.route = 'http://' + nodeHost.hostname + ":" + nodeHost.port
                    }
                })
            return vespaState
        });
    return defer({
        vespaState: vespaState
    });
}

function getVespaState(configHost) {
    const vispanaClient = new VispanaApiClient()
    return vispanaClient.fetchVespaState(configHost)
}

export default Layout;
