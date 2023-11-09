// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {androidstudio} from 'react-syntax-highlighter/dist/esm/styles/hljs';

// react imports
import React from 'react'
import {useOutletContext} from "react-router-dom";
import TabView from "../../components/tabs/tab-view";

function AppPackage() {
    const {vespaState} = useOutletContext();

    const schemas = vespaState
        .state
        .content
        .clusters
        .flatMap(cluster => {
            return cluster
                .contentData
                .map(data => {
                    return {
                        "tabName": `${data.schema.schemaName}.sd`,
                        "payload": data.schema.schemaContent,
                        "contentType": "yaml"
                    };
                })
        })
        .sort((a, b) => a.tabName.localeCompare(b.tabName));

    const services = {
        "tabName": "services.xml",
        "payload": vespaState.state.applicationPackage.servicesContent,
        "contentType": "xml"
    };

    const hosts = {
        "tabName": "hosts.xml",
        "payload": vespaState.state.applicationPackage.hostsContent,
        "contentType": "xml"
    };


    const tabs = [services, hosts, ...schemas]
        .map(tab => {
                return {
                    "header": tab.tabName,
                    "content":
                        <SyntaxHighlighter language={tab.contentType} style={androidstudio}>
                            {tab.payload}
                        </SyntaxHighlighter>
                }
            }
        )

    tabs.push({
        "header": "about",
        "content":
            <div className="mt-8 mb-3">
                <p><span className="text-yellow-400">Generation:</span> {vespaState.state.applicationPackage.appPackageGeneration}</p>
            </div>
    })

    return (
        <div className="flex-1 max-h-full max-w-full bg-darkest-blue">
            <div className="flex flex-grow flex-col pt-2 normal-case" style={{minWidth: "0"}}>
                <div className="bg-standout-blue p-4 mt-4">
                    <TabView tabs={tabs}></TabView>
                </div>

            </div>
        </div>

    );
}

export default AppPackage;
