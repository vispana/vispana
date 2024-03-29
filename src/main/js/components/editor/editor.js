import React, {useEffect} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/snippets/json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/ext-language_tools";
import {LanguageProvider} from "ace-linters/build/ace-linters";
import schema from "./query-schema"

function Editor({query, setQuery, handleRunQuery, handleFormatQuery}) {
    const provider = LanguageProvider.fromCdn("https://cdn.jsdelivr.net/npm/ace-linters/build");
    //link schema to json service
    provider.setGlobalOptions("json", {
        schemas: [
            {
                uri: "common.schema.json",
                schema: JSON.stringify(schema(), null, 2)
            }
        ]
    });

    const editorRef = React.useRef(null);
    useEffect(() => {
        if (editorRef?.current?.editor) {
            const editor = editorRef.current.editor
            const commands = []
            if (handleRunQuery) {
                commands.push({
                    name: 'run query',
                    exec: handleRunQuery,
                    bindKey: {mac: "Command-Enter", win: "Ctrl-Enter"}
                })
            }
            if (handleFormatQuery) {
                commands.push({
                    name: 'format query',
                    exec: () => handleFormatQuery(query),
                    bindKey: {mac: "Command-Option-L", win: "Ctrl-Alt-L"}
                })
            }
            editor.commands.addCommands(commands)
        }
    }, [editorRef?.current?.editor, query])

    return (<AceEditor
        ref={editorRef}
        height={"210px"}
        placeholder="Placeholder Text"
        mode="json"
        theme="tomorrow_night"
        name="query"
        onLoad={(editor) => {
            provider.registerEditor(editor);
            provider.setSessionOptions(editor.session, {schemaUri: "common.schema.json"});
        }}
        className="min-w-full bg-standout-blue"
        onChange={(value, event) => {
            setQuery(value)
        }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={query}
        setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false
        }}/>)
}

export default Editor;