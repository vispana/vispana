import React, {useEffect, useState} from 'react'
import {NavLink, Outlet, useFetcher, useLoaderData} from "react-router-dom";
import VispanaApiClient from "../../client/vispana-api-client";

function Layout() {
    const loaderData = useLoaderData();
    const fetcher = useFetcher();

    // create 'vespaState' state
    const [vespaState, setVespaState] = useState(loaderData);

    // refresh interval state
    const refreshIconClass = "fas fa-sync-alt"
    const [refreshInterval, setRefreshInterval] = useState(-1);
    const [refreshIcon, setRefreshIcon] = useState(refreshIconClass);

    // store application URI for redirecting once refresh is triggered.
    // there's probably a better alternative than calling 'fetcher.load', however it's
    // 4AM and it's working.
    const parentUri = `/app?config_host=${vespaState.queryConfigHost}`;

    // Code below sets the expected effects once refreshes changes
    useEffect(() => {
        // only schedule refreshes if interval is bigger than 0
        if(refreshInterval > 0) {
            const interval = setInterval(() => {
                if (document.visibilityState === "visible") {
                    fetcher.load(parentUri);
                }
            }, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    useEffect(() => {
        if (fetcher.data) {
            setVespaState(fetcher.data)
        }
    }, [fetcher.data]);

    useEffect(() => {
        if(fetcher.state === "idle") {
            setRefreshIcon(refreshIconClass)
        } else {
            setRefreshIcon(refreshIconClass + " fa-spin text-yellow-400")
        }
    }, [fetcher.state]);


    return (<>
        <main role="main" className="h-screen flex flex-row flex-wrap">
            <div id="sideBar"
                 className="relative h-screen  flex flex-col flex-wrap p-6 flex-none w-56 md:-ml-64 md:fixed md:top-0 md:z-30 md:h-screen md:shadow-xl animated faster bg-standout-blue">
                <div className="flex flex-col">
                    <div
                        className="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                        <div
                            className="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400">
                            <a href="/">
                                <img alt="" src="/img/icons8-hive-64.png"
                                     className="icon icon-tabler icon-tabler-stack"/>
                            </a>
                        </div>
                    </div>
                    <NavLink to={`config?config_host=${vespaState.queryConfigHost}`} className={navLinkStyle()}>
                        <i className="fas fa-project-diagram text-xs mr-2"></i>
                        Config
                    </NavLink>

                    <NavLink to={`container?config_host=${vespaState.queryConfigHost}`} className={navLinkStyle()}>
                        <i className="fas fa-microchip text-xs mr-2"></i>
                        Container
                    </NavLink>

                    <NavLink to={`content?config_host=${vespaState.queryConfigHost}`} className={navLinkStyle()}>
                        <i className="fas fa-hdd text-xs mr-2"></i>
                        Content
                    </NavLink>

                    <NavLink to={`apppackage?config_host=${vespaState.queryConfigHost}`} className={navLinkStyle()}>
                        <i className="fas fa-archive text-xs mr-2"></i>
                        Application Package
                    </NavLink>
                </div>
            </div>
            <div className="flex-1 h-screen p-6 md:mt-16 overflow-x-auto w-full">
                <div>
                    <div className="space-x-1 w-full">
                        <div className="text-right font-flow" style={{textAlign: "right"}}>

                                <a className="text-xs btn btn-square btn-sm bg-standout-blue border-0 hover:bg-standout-blue hover:border-0 active:border-0"
                                   style={{marginRight: '2px'}} onClick={() => {
                                    fetcher.load(`/app?config_host=${vespaState.queryConfigHost}`)
                                }}>
                                    <i className={refreshIcon}></i>
                                </a>
                                <select className="select select-sm w-40 max-w-xs bg-standout-blue text-xs focus:ring-0"
                                        id="form_interval" name="refresh_interval[interval]" defaultValue={-1} onChange={(event) => {
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
                        <Outlet context={{vespaState}}/>
                    </div>
                    <div className="flex-1 p-6 md:mt-16">
                        <div className="flex flex-grow flex-col pt-2 normal-case">
                            <div className="-my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto text-center text-xs text-gray-400">
                                <p>© 2021 — MIT License</p>
                                <p><a href="https://icons8.com/icon/65460/hive">Hive icon by Icons8</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>);

    function navLinkStyle() {
        return ({isActive}) => {
            if (isActive) {
                return "mb-3 capitalize font-medium text-sm transition ease-in-out duration-100 text-yellow-400"
            } else {
                return "mb-3 capitalize font-medium text-sm hover:text-white transition ease-in-out duration-500 text-gray-300"
            }
        };
    }
}

export async function loader({request}) {
    const url = new URL(request.url);
    const configHost = url.searchParams.get("config_host");
    return await getVespaState(configHost);
}

async function getVespaState(configHost) {
    const vispanaClient = new VispanaApiClient(configHost)
    const vespaState = await vispanaClient.fetchVespaState(configHost)
    return {
        "queryConfigHost": configHost,
        "state": vespaState
    }
}

export default Layout;
