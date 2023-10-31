import React from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function TabView({ tabs }) {
    tabs.forEach(tab => {
        if(! tab.hasOwnProperty('header') || !tab.hasOwnProperty('content')) {
            throw new Error(`Expected 'header' and 'content' properties in TabView. Got: ${tab}`)
        }
    })

    return (
        <div className="w-full">
        <Tabs>
            <TabList className="flex justify-left items-left min-w-full">
                { tabs
                    .map((tab, index) => (
                        <Tab className="cursor-pointer py-2 px-4 border-b-2 text-gray-500 border-gray-500"
                             selectedClassName="cursor-pointer py-2 px-4 border-b-2 text-yellow-400 border-yellow-400"
                             style={{minWidth: "120px"}}
                             key={index}>
                            {tab.header}
                        </Tab>))}

                {/* Support tab to fill up the screen*/}
                <Tab key={tabs.length + 1} className="flex-grow text-xs py-2 px-4 text-gray-500 border-gray-500 border-b-2"
                     disabled={true}>
                </Tab>
            </TabList>

            { tabs
                .map((tab, index) => (
                    <TabPanel key={index}>
                        {tab.content}
                    </TabPanel>))}

            {/* Support tab to fill up the screen*/}
            <TabPanel key={tabs.length}></TabPanel>
        </Tabs>
        </div>
    )
}
export default TabView;
