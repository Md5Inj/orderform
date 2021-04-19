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
                    loadFilesFromCsvUrl={this.props.config.loadFilesFromCsvUrl}
                    formKey={this.props.config.formKey}
                />
                <ProductsFromCsv
                    loadFilesFromCsvUrl={this.props.config.loadFilesFromCsvUrl}
                    readFileUrl={this.props.config.readFileUrl}
                    formKey={this.props.config.formKey}
                />
            </div>
        )
    }
}

export default AddProductsForm;
