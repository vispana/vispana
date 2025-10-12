import SyntaxHighlighter from 'react-syntax-highlighter';
import {androidstudio} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import React, {useState} from 'react';

// Component for displaying individual rank profile
function RankProfileItem({ profileName, profileContent }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="bg-gray-800 rounded p-3">
            <div 
                className="cursor-pointer flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <i className={`fas fa-caret-${isExpanded ? 'down' : 'right'} text-xs mr-2`}></i>
                <i className="fas fa-file text-xs mr-2"></i>
                <span className="text-yellow-400 font-medium">{profileName}.profile</span>
            </div>
            {isExpanded && (
                <div className="mt-2">
                    <SyntaxHighlighter 
                        language="yaml" 
                        style={androidstudio}
                    >
                        {profileContent}
                    </SyntaxHighlighter>
                </div>
            )}
        </div>
    );
}

// Component for displaying rank profiles
function SchemaDefinition({ schemaContent, rankProfiles }) {
    const [rankProfilesExpanded, setRankProfilesExpanded] = useState(false);
    
    return (
        <div className="mb-4">
            {/* Rank Profiles Section */}
            {rankProfiles && Object.keys(rankProfiles).length > 0 && (
                <div className="mb-6">
                    <div 
                        className="cursor-pointer flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200 mb-3"
                        onClick={() => setRankProfilesExpanded(!rankProfilesExpanded)}
                    >
                        <i className={`fas fa-caret-${rankProfilesExpanded ? 'down' : 'right'} text-xs mr-2`}></i>
                        <i className="fas fa-cogs text-xs mr-2"></i>
                        <span className="font-medium">Rank Profiles ({Object.keys(rankProfiles).length})</span>
                    </div>
                    {rankProfilesExpanded && (
                        <div className="ml-6 space-y-2">
                            {Object.entries(rankProfiles).map(([profileName, profileContent]) => (
                                <RankProfileItem 
                                    profileName={profileName} 
                                    profileContent={profileContent} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Schema Content */}
            <div className="border-t border-gray-600 pt-4">
                <div className="text-yellow-400 text-sm font-medium mb-2">Schema Definition</div>
                <SyntaxHighlighter language="yaml" style={androidstudio}>
                    {schemaContent}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

export default SchemaDefinition;