import React from 'react';
import ProductsFromSku from "./ProductsFromSku/ProductsFromSku";
import ProductsFromCsv from "./ProductsFromCsv/ProductsFromCsv";

import './AddProductsForm.css';

class AddProductsForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="addProductsForm">
                <ProductsFromSku
                    graphqlUrl={this.props.config.graphqlUrl}
                />
                <ProductsFromCsv
                    readFileUrl={this.props.config.readFileUrl}
                    formKey={this.props.config.formKey}
                    graphqlUrl={this.props.config.graphqlUrl}
                />
            </div>
        )
    }
}

export default AddProductsForm;
