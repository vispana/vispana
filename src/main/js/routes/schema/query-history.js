import React from "react";
import DataTable, {createTheme} from "react-data-table-component";
import SyntaxHighlighter from "react-syntax-highlighter";
import {androidstudio} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import HistoryClient from "../../client/history-client";
import {queryFieldFromSearchParam} from "./query";

const FilterComponent = ({ filterText, onFilter}) => (
    <>
        <div style={{ display: 'flex', alignItems: 'left', minWidth: '30%' }}>
            <div className="form-control w-full">
                <div className="font-search">
                    <input id="search"
                           className="border text-sm rounded-lg block w-full p-1.5 bg-standout-blue border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 text-center input-bordered"
                           value={filterText}
                           onChange={onFilter}
                           type="text"
                           placeholder="Filter"
                           aria-label="Search Input"
                    />
                    <i className="fa fa-search"></i>
                </div>
            </div>
        </div>
    </>
);

function QueryHistory({schema, tabSelector, searchParams, setSearchParams}) {
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

    const historyClient = new HistoryClient()
    const queryHistory = historyClient.fetchHistory()
    const filteredItems = queryHistory.filter(item => {
        return item.query && item.query.toLowerCase().includes(filterText.toLowerCase())
    });
    const subHeaderComponentMemo = React.useMemo(() => {
        return <FilterComponent onFilter={e => setFilterText(e.target.value)} filterText={filterText} />;
    }, [filterText, resetPaginationToggle]);

    const columns = [
        {
            name: '',
            selector: row => row.query,
            maxWidth: '150px',
            cell: row => (
                <button id="search"
                        className="border text-xs rounded-lg block w-28 p-1 bg-standout-blue text-yellow-400 border-yellow-400 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-center input-bordered"
                        onClick={() => {
                            searchParams.set(queryFieldFromSearchParam(schema), row.query)
                            setSearchParams(searchParams)
                            tabSelector(0)
                        }}
                        type="text"
                        placeholder="Filter"
                        aria-label="Search Input"> Query </button>
            )
        },
        {
            name: 'Time',
            selector: row => row.timestamp,
            sortable: true,
            maxWidth: '200px',
        },
        {
            name: 'Vespa instance',
            selector: row => row.vespaInstance,
            maxWidth: '200px',
            sortable: true,
        },
        {
            name: 'Query',
            selector: row => row.query,
        },
    ]

    // customize theme
    createTheme('dark', {
        text: {
            // primary: '#facc15',
            primary: '#fff',
            secondary: '#fff',
        },
        background: {
            default: '#1f2a40',
        },
        highlightOnHover: {
            default: '#3b4f77',
            text: '#fff',
        },
        striped: {
            default: '#2c3c5a',
            text: '#fff',
        },
        context: {
            text: '#facc15',
        },
        divider: {
            default: 'rgb(20 27 45 / var(--tw-bg-opacity))',
        },
    });

    const NoDataConst = props => {
        return <><span className="text-yellow-400 m-8">There are no records to display</span></>
    }

    return (
        <DataTable
            theme="dark"
            customStyles={{
                head: {
                    style: {
                        color: '#facc15'
                    }
                },
                subHeader: {
                    style: {
                        minHeight: '52px'
                    },
                }
            }}
            columns={columns}
            data={filteredItems}
            fixedHeader

            pagination
            paginationResetDefaultPage={resetPaginationToggle} //a hook to reset pagination to
            // page 1
            responsive

            striped
            highlightOnHover
            pointerOnHover

            subHeader
            subHeaderAlign="right"
            subHeaderWrap
            subHeaderComponent={subHeaderComponentMemo}

            expandableRows
            expandOnRowClicked
            expandableRowsComponent={ExpandedComponent}

            noDataComponent={<NoDataConst/>}
        />
    )
}

const ExpandedComponent = ({data}) => {
    const cloneData = { ...data };
    cloneData.query = JSON.parse(cloneData.query)
    return <SyntaxHighlighter language="json" style={androidstudio}>
        {JSON.stringify(cloneData, null, 2)}
    </SyntaxHighlighter>
};

export default QueryHistory;
