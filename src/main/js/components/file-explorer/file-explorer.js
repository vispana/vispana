import React, {useState} from 'react';

function FileExplorer({node}) {
    const [dirExpanded, setDirExpanded] = useState(true);
    const [fileExpanded, setFileExpanded] = useState(false);

    if (node.file) {
        return (
            <div className="pl-4 text-white" >
                <div className="cursor-pointer" onClick={() => setFileExpanded(!fileExpanded)}>
                    📄 {node.name}
                </div>
                {fileExpanded && (
                    <pre className="bg-gray-900 p-2 mt-1 text-sm">{node.content}</pre>
                )}
            </div>
        );
    }

    return (
        <div className="pl-4 text-white">
            <div className="cursor-pointer" onClick={() => setDirExpanded(!dirExpanded)}> 
                📁 {node.name}
            </div>
            {dirExpanded && node.children && (
                <div className="ml-4 border-l border-gray-600 pl-2">
                    {Object.entries(node.children).map(([key, childNode]) => (
                        <FileExplorer key={key} node={childNode} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FileExplorer;
