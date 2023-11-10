// react imports
import React from 'react'

function Loading() {
    return (<>
        <main role="main" className="h-screen flex flex-row flex-wrap">
            <div className="hero min-h-screen bg-darkest-blue">
                <div className="flex-col justify-center hero-content lg:flex-row w-full">
                    <span className="loading loading-ring loading-lg"></span>
                </div>
            </div>
        </main>
    </>);
}

export default Loading;
