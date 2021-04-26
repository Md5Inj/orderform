import React from 'react';
import Search from "./Search/Search";
import Products from "./Products/Products";
import AddProductsForm from './AddProductsForm/AddProductsForm';
import Storage from "./Storage";
import Loader from './Loader/Loader';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };

        if (Storage.getItem("cartId") === null) {
            this.setState({isLoading: true});
            fetch(this.props.config.getCartIdUrl, {
                method: "POST"
            })
                .then(response => response.json())
                .then((response) => {
                    Storage.setItem("cartId", response.replace("\"", ""));
                    this.setState({isLoading: false});
                });
        }
    }

    render() {
        return (
            <div id="orderForm" className="orderForm">
                <h1 className="pageTitle">Order form</h1>
                <Search />
                <div className="productsManage">
                    <Products
                        currencySymbol={this.props.config.currencySymbol}
                        graphqlUrl={this.props.config.graphqlUrl}
                        addToCartUrl={this.props.config.getAddToCartUrl}
                        formKey={this.props.config.formKey}
                        getCartIdUrl={this.props.config.getCartIdUrl}
                        clearCartUrl={this.props.config.clearCartUrl}
                    />
                    <AddProductsForm
                        config={this.props.config}
                    />
                </div>
                { this.state.isLoading &&
                <Loader/>}
            </div>
        );
    }
}

export default App;
