import React from 'react';

import './Grid.css';

class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="productGridWrapper">
                <div className="table">
                    <div className="thead">
                        <div className="tr">
                            {this.props.tableHeaders.map((thead, key) => {
                                return (<div className={"th " + thead.class} key={key}>{thead.title}</div>)
                            })}
                        </div>
                    </div>
                    <div className="tbody">
                        {this.props.tableData}
                    </div>
                </div>
            </div>
        )
    }
}

export default Grid;
