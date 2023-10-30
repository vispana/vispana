// necessary import to bundle CSS into a package with postcss
import '../../../resources/static/main.css'

// react imports
import React from 'react'
import { useOutletContext} from "react-router-dom";

function Config() {
    const vespaState = useOutletContext();
    return (
        <>Config code</>
    );
}

export default Config;
