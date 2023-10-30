// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import {useOutletContext} from "react-router-dom";

function Content() {
    const vespaState = useOutletContext();

    return (
        <>Content code</>
    );
}

export default Content;
