// react imports
import React from 'react'

function Loading({centralize = true}) {
    const alignCenter = centralize ? "hero min-h-screen" : "mt-8"
    return (<>
        <main role="main" className="h-screen flex flex-row flex-wrap min-w-full">
            <div className={`${alignCenter} min-w-full`}>
                <div className="flex-col justify-center hero-content flex-row min-w-full">
                    <span className="loading loading-ring loading-lg"></span>
                </div>
            </div>
        </main>
    </>);
}

export default Loading;
