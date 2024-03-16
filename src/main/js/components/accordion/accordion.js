import React from "react";
import {useState} from "react"

const Accordion = ({
                       controllerElement,
                       contentDescription,
                       children,
                   }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    return (
        <div className="mt-2">
            <div
                aria-expanded={isExpanded}
                aria-controls={contentDescription}
                aria-label={(isExpanded ? "show " : "hide ") + contentDescription}
                onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
            >
                {controllerElement(isExpanded)}
            </div>
            {isExpanded && (
                <div id={contentDescription} className="w-full flex flex-col pl-4" style={{maxWidth: "220px"}}>
                    {children}
                </div>
            )}
        </div>
    )
}

export function accordionHeaderController(isExpanded) {
    return (
        <a className="mt-3 capitalize font-medium text-sm hover:text-white transition ease-in-out duration-500 text-gray-300 cursor-pointer">
            <i className="fas fa-file text-xs mr-2"></i>
            <span className="mr4"> Schemas </span>
            <i className={isExpanded ? "fas fa-caret-up text-xs ml-1" : "fas fa-caret-down" +
                " text-xs ml-1"}></i>
        </a>)
}

export default Accordion
