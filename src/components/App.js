import React from 'react';
import Search from "./Search/Search";
import Products from "./Products/Products";
import AddProductsForm from './AddProductsForm/AddProductsForm';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: document.global_data_for_react_app,
            selected: false,
            selectedItem: null,
            count: 1
        };
    }

    render() {
        return (
            <div id="react">
                <h1 className="pageTitle">Place a Quick Order</h1>
                <Search />
                <div className="productsManage">
                    <Products
                        currencySymbol={this.props.config.currencySymbol}
                    />
                    <AddProductsForm
                        config={this.props.config}
                    />
                </div>
            </div>
        );
    }
}

export default App;
