import React from 'react';

import './Grid.css';

class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="productGridWrapper">
                <table>
                    <thead>
                        <tr>
                            {this.props.tableHeaders.map((thead) => {
                                return (<th className={thead.class}>{thead.title}</th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.tableData}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Grid;
