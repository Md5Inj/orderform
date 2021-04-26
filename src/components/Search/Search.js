import React from 'react';

import './Search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchCompleted: true
        }
    }

    searchProducts = (e) => {

    }

    render() {
        return (
            <div className="productSearch">
                <input type="search" className="productSearchInput" onChange={this.searchProducts} placeholder="Search by SKU or Product Name"/>
                {this.state.searchCompleted &&
                <ul className="search-results">
                    <li className="product">
                        <div className="sku">SKU</div>
                        <div className="price">Price</div>
                        <button>Add</button>
                    </li>
                </ul>}
            </div>
        )
    }
}

export default Search;
