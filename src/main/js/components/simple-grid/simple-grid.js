import React, {Children} from 'react'
import { header as table_header} from "./simple-grid-row";
import {Tooltip} from "react-tooltip";

function SimpleGrid({ header, children, hasDistributionKey }) {
    return (
        <div className="w-full text-center mx-auto">
            <div>
                <div className="text-left text-yellow-400 my-4">
                    <span>{header} ({Children.count(children)})</span>
                </div>
                <div>
                    <table id="content" className="min-w-full min-h-full divide-y divide-darkest-blue rounded-md shadow-md border border-1 border-standout-blue">
                        <tbody className="bg-standout-blue divide-y divide-darkest-blue">
                            { table_header(hasDistributionKey) }
                            { children }
                        </tbody>
                    </table>
                    <Tooltip id="vispana-tooltip" />
                </div>
            </div>
        </div>
    )
}
export default SimpleGrid;
