import React from 'react'
import {useRouteError} from "react-router-dom";

function VispanaError({errorMessage, showLogo= true}) {
    const error = useRouteError();
    console.log(error)

    errorMessage = errorMessage ? errorMessage : {
        title: "Some error happened while trying to process the request.",
        description: "Make sure you are pointing correctly to a Vespa cluster with a running application."
    }

    const genericError = (<div>
        <p>{errorMessage.title}</p>
        <br/>
        <p className="text-sm italic break-words">{errorMessage.description}</p>
    </div>)

    const alignCenter = showLogo ? "hero min-h-screen" : ""
    return (<>
        <main role="main" className="h-screen flex flex-row flex-wrap min-w-full">
            <div className={`${alignCenter} min-h-screen bg-darkest-blue min-w-full`}>
                <div className="flex-col justify-center hero-content lg:flex-row min-w-full">
                    <div
                        className="card flex-shrink-0 w-full max-w-1/2 shadow-2xl bg-standout-blue overflow-visible" >
                        <div style={{position: "absolute", top: "-50px", left: "calc(50% - 40px)"}}
                             className="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                            {showLogo ? <div
                                className="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400 overflow-hidden">
                                <a href="/"><img alt="" src="/img/vispana-broken-logo.png"
                                                 className="icon icon-tabler icon-tabler-stack"/></a>
                            </div> : <></>}
                        </div>
                        <div className={`flex ${showLogo? "mt-10": ""} card-body w-800 text-center`}>
                            <span className="text-yellow-400">Opzzz..</span>
                            {error && error.status === 404 ?
                                <div>Page not found x_x</div> : genericError}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>);
}

export default VispanaError;
