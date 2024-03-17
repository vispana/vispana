import React, {useState} from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function TabView({ tabs, currentTab, tabSelector }) {
    if(currentTab === undefined || !tabSelector === undefined ) {
        const [tabIndex, setTabIndex] = useState(0);
        currentTab = tabIndex;
        tabSelector = setTabIndex;
    }

    tabs.forEach(tab => {
        if(! tab.hasOwnProperty('header') || !tab.hasOwnProperty('content')) {
            throw new Error(`Expected 'header' and 'content' properties in TabView. Got: ${tab}`)
        }
    })

    return (
        <div className="w-full max-w-full min-w-full">
        <Tabs selectedIndex={currentTab} onSelect={(index) => tabSelector(index)}>
            <TabList className="flex justify-left items-left component-no-scrollbar overflow-x-scroll">
                { tabs
                    .map((tab, index) => (
                        <Tab className="min-w-fit cursor-pointer py-2 px-4 border-b-2 text-gray-500 border-gray-500 "
                             selectedClassName="cursor-pointer py-2 px-4 border-b-2 text-yellow-400 border-yellow-400"
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
