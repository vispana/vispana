'use strict';

// react imports
import React from 'react'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import { createRoot } from 'react-dom/client';

// application imports
import Index, {action as indexAction} from "./routes/index"
import Layout, {loader as layoutLoader} from "./routes/layout/layout";
import Config from "./routes/config/config"
import Container from "./routes/container/container";
import Content from "./routes/content/content";
import AppPackage from "./routes/apppackage/app-package";
import VispanaError from "./routes/error/vispana-error";
import Schema from "./routes/schema/schema";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" errorElement={<VispanaError/>}>
            <Route index={true} element={<Index />} action={indexAction}></Route>
            <Route path="app" element={<Layout />} loader={layoutLoader}>
                <Route path="config" element={<Config />} />
                <Route path="container" element={<Container />} />
                <Route path="content" element={<Content />} />
                <Route path="apppackage" element={<AppPackage />} />
                <Route path="schema/:schema" element={<Schema />}/>
            </Route>
        </Route>
    ));

createRoot(document.getElementById("react")).render(
    <RouterProvider router={router} />
)
