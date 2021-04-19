import React from 'react';

import './ProductActions.css';

class ProductActions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="productActions">
                <button className="AddToQuote">Add to quote</button>
                <button className="AddToCart">Add to cart</button>
            </div>
        )
    }
}

export default ProductActions;
