import React from 'react'

function SimpleGridRow({data, hasDistributionKey = false}) {
    const {id, host, processesStatus, hostMetrics, group} = data;

    return (
        <>
            <tr>
                {renderProcessesStatus()}
                {renderHost()}
                {hasDistributionKey ? renderDistributionKey() : <></>}
                {renderMetrics()}

            </tr>
        </>
    )

    function renderProcessesStatus() {
        return (
            <td className="px-1 text-sm pb-1">
                <div className="flex justify-center w-full">
                    {
                        Object.keys(processesStatus)
                            .map(processName => {
                                const processData = processesStatus[processName];
                                let className = "rounded-full px-1 py-1 "
                                switch (processData.toLowerCase()) {
                                    case 'up':
                                        className += "service_up"
                                        break;
                                    case 'down':
                                        className += "service_down"
                                        break;
                                    default:
                                        className += "service_unknown"
                                        break;
                                }

                                return <div key={id + processName} className="flex pr-1">
                                    <div className={className}
                                         data-tooltip-id="vispana-tooltip"
                                         data-tooltip-content={processName}
                                         data-tooltip-place="top"></div>
                                </div>
                            })
                    }
                </div>
            </td>);
    }

    function renderHost() {
        return (
            <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-300">
                <p className="overflow-ellipsis overflow-hidden">{host.hostname}</p>
            </td>
        )
    }

    function renderDistributionKey() {
        return (
            <td className="px-6 py-2">
                <div className="flex justify-center -m-2">
                    <div
                        className="px-2 h-6 text-green-300 text-xs font-extrabold rounded-md flex items-center justify-center border-dashed border border-green-300 m-2"
                        style={{minWidth: "80px"}}>
                        Group: {group.key}
                    </div>
                    <div
                        className="px-2 h-6 text-green-300 text-xs font-extrabold rounded-md flex items-center justify-center border-dashed border border-green-300 m-2"
                        style={{minWidth: "110px"}}>
                        Distribution: {group.distribution}
                    </div>
                </div>
            </td>
        )
    }

    function renderMetrics() {
        const cpuUsage = hostMetrics.cpuUsage
        const memoryUsage = hostMetrics.memoryUsage
        const diskUsage = hostMetrics.diskUsage
        let cpuUsageClassName = metricsProgressClass(cpuUsage);
        let memoryUsageClassName = metricsProgressClass(memoryUsage);
        let diskUsageClassName = metricsProgressClass(diskUsage);

        return (
            <>
                <td className="px-6 " style={{minWidth: "100px", maxWidth: "200px"}}>
                    <div style={{minWidth: "100px", maxWidth: "200px", margin: "auto"}}>
                        <progress className={cpuUsageClassName}
                                  data-tooltip-id="vispana-tooltip"
                                  data-tooltip-content={cpuUsage.toFixed(2) + "%"}
                                  data-tooltip-place="top"
                                  value={`${cpuUsage}`}
                                  max="100">
                        </progress>
                    </div>
                </td>
                <td className="px-6 " style={{minWidth: "100px", maxWidth: "200px"}}>
                    <div style={{minWidth: "100px", maxWidth: "200px", margin: "auto"}}>
                        <progress className={memoryUsageClassName}
                                  data-tooltip-id="vispana-tooltip"
                                  data-tooltip-content={memoryUsage.toFixed(2) + "%"}
                                  data-tooltip-place="top"
                                  value={`${memoryUsage}`}
                                  max="100">
                        </progress>
                    </div>
                </td>
                <td className="px-6 " style={{minWidth: "100px", maxWidth: "200px"}}>
                    <div style={{minWidth: "100px", maxWidth: "200px", margin: "auto"}}>
                        <progress className={diskUsageClassName}
                                  data-tooltip-id="vispana-tooltip"
                                  data-tooltip-content={diskUsage.toFixed(2) + "%"}
                                  data-tooltip-place="top"
                                  value={`${diskUsage}`}
                                  max="100">
                        </progress>
                    </div>
                </td>
            </>
        )
    }
}

export function header(hasDistributionKey = false) {
    return <>
        <tr>
            <th scope="col" className="px-6 text-sm font-medium text-blue-100 tracking-wider"
                style={{padding: "1rem"}}>
                <span>Status</span>
            </th>
            <th scope="col" className="px-6 text-sm font-medium text-blue-100 tracking-wider"
                style={{padding: "1rem"}}>
                <span>Hosts</span>
            </th>
            {hasDistributionKey ?
                <th scope="col" className="px-6 text-sm font-medium text-blue-100 tracking-wider"
                    style={{padding: "1rem"}}>
                    <span>Distribution key</span>
                </th> : <></>
            }
            <th scope="col" className="px-6 text-sm font-medium text-blue-100 tracking-wider"
                style={{padding: "1rem"}}>
                <span>CPU usage</span>
            </th>
            <th scope="col" className="px-6 text-sm font-medium text-blue-100 tracking-wider"
                style={{padding: "1rem"}}>
                <span>Memory usage</span>
            </th>
            <th scope="col" className="px-6 text-sm font-medium text-blue-100 tracking-wider"
                style={{padding: "1rem"}}>
                <span>Disk usage</span>
            </th>
        </tr>
    </>
}

export function metricsProgressClass(metric) {
    let className = "progress "
    if (metric > 80) {
        className += "progress-error"
    } else if (metric > 50) {
        className += "progress-warning"
    } else {
        className += "progress-success"
    }
    return className;
}

export default SimpleGridRow;
