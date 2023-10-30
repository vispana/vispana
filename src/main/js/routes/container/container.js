// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import {useOutletContext} from "react-router-dom";

function Container() {
    const vespaState = useOutletContext();

    return (
        <>Container code</>
    );
}

export default Container;
