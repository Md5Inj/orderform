import React from 'react';
import Papa from "papaparse";
import Storage from "../../Storage";
import Loader from "../../Loader/Loader";
import Notifications, {notify} from "react-notify-toast";

import './ProductsFromCsv.css';

class ProductsFromCsv extends React.Component {
    constructor(props) {
        super(props);
        this.defaultInputText = "Choose file +";

        this.state = {
            fileInputLabel: this.defaultInputText,
            uploadedFile: undefined,
            isLoading: false
        }
    }

    importFromCsv = () => {
        if (this.state.uploadedFile === undefined) {
            notify.show("You should choose the file", 'error');
            return;
        }

        this.setState({
            isLoading: true
        });
        let formData = new FormData();

        formData.append("file", this.state.uploadedFile);
        formData.append("form_key", this.props.formKey);

        fetch(this.props.readFileUrl, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then((response) => {
                Papa.parse(response.content, {
                    complete: (result) => {
                        let cartId = Storage.getItem("cartId");
                        let data = `
                        mutation {
                            addSimpleProductsToCart(
                                input: {
                                    cart_id: "${cartId}"
                                    cart_items: [`;

                        result.data.forEach((product) => {
                            if (product[0] !== undefined && product[1] !== undefined) {
                                data += `
                                {
                                    data: {
                                        quantity: ${product[1]}
                                        sku: "${product[0]}"
                                    }
                                }`;
                            }
                        });

                        data += ` ]
                        }
                    ) {
                        cart {
                            items {
                                id
                                product {
                                    name
                                    sku
                                }    
                                quantity
                            }
                        }
                    }
                }`;

                        fetch(this.props.graphqlUrl, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                query: data
                            })
                        })
                            .then(response => response.json())
                            .then((response) => {
                                if (response.errors !== undefined && response.errors.length !== 0) {
                                    response.errors.forEach(error => {
                                        notify.show(error.message, 'error');
                                    })
                                }
                                window.dispatchEvent(new Event('productsOperation'));
                                this.setState({
                                    isLoading: false
                                });
                            });
                    }
                });
            })
    }

    fileUpload = (e) => {
        let files = e.target.files;

        this.setState({
            uploadedFile: files[0],
            fileInputLabel: files.length !== 0 ? files[0].name : this.defaultInputText
        });
    }

    render() {
        return (
            <div className="addFromFile">
                <span className="inputLabel">Add from File</span>
                <input type="file" id="fileUpload" accept=".xml,.csv" onChange={this.fileUpload}/>
                <label htmlFor="fileUpload" className="inputLabel">{this.state.fileInputLabel}</label>
                <div className="comment">File must be in .csv format and include “SKU” and “QTY” columns.</div>
                <div className="productFormButtonWrapper">
                    <button className="upload" onClick={this.importFromCsv}>Import</button>
                    {this.state.isLoading &&
                    <Loader/>}
                    <Notifications/>
                </div>
            </div>
        )
    }
}

export default ProductsFromCsv;
