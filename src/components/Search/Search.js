import React from 'react';

import './Search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="productSearch">
                <input type="search" className="productSearchInput" placeholder="Search by SKU or Product Name"/>
            </div>
        )
    }
}

export default Search;
