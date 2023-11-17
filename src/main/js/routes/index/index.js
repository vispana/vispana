// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import {Form, redirect, useActionData} from "react-router-dom";

function Index() {
    const error = useActionData();
    const errorElement = error?
        <div className="form-control">
            <span className="invalid-feedback">{error.message}</span>
        </div> : <span></span>

    return (<>
        <main role="main" className="h-screen flex flex-row flex-wrap">
            <div className="hero min-h-screen bg-darkest-blue">
                <div className="flex-col justify-center hero-content lg:flex-row w-full">
                    <div
                        className="card flex-shrink-0 w-full max-w-1/2 shadow-2xl bg-standout-blue overflow-visible">
                        <div style={{position: "absolute", top: "-50px", left: "calc(50% - 40px)"}}
                             className="flex flex-row flex-start justify-center mb-3 capitalize font-medium text-sm hover:text-teal-600 transition ease-in-out duration-500">
                            <div
                                className="mb-3 w-24 h-24 rounded-full bg-white flex items-center justify-center cursor-pointer text-indigo-700 border-4 border-yellow-400 overflow-hidden">
                                <img alt="" src={logoPath()} className="icon icon-tabler icon-tabler-stack"/>
                            </div>
                        </div>
                        <div className="flex mt-10 card-body w-800 ">
                            <Form method="post">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Vespa Configuration URL</span>
                                    </label>
                                    <input name="config_host"

                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center input-bordered"
                                           required
                                           placeholder="e.g.: http://localhost:19071"
                                           type="text"/>
                                </div>
                                <div className="form-control"/>
                                {errorElement}
                                <div className="form-control mt-4">
                                    <button className="btn btn-ghost" type="submit">Connect</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>);
}

export async function action({ request }) {
    const data = await request.formData();
    const configHost = data.get("config_host");
    const regex = new RegExp("^(http|https):\\/\\/\\S+$")
    const urlSearchParam = new URLSearchParams({config_host: configHost}).toString()

    if(regex.test(configHost)) {
        return redirect(`/app/config?${urlSearchParam}`)
    }
    return {message: "Host must have protocol (e.g., http:// or https://) and no spaces"};
}

export function logoPath() {
    const index = Math.floor(Math.random() * 6) + 1
    return `/img/vispana-logo-${index}.png`;
}

export default Index;
