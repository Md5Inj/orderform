import React from 'react';

class Totals extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="total">
                <span className="price">Total price: {this.props.currencySymbol}<span>{this.props.totalPrice.toFixed(2)}</span></span>
                <span className="comment">Taxes, discounts, tier prices etc mau apply after adding items to cart</span>
            </div>
        )
    }
}

export default Totals;
