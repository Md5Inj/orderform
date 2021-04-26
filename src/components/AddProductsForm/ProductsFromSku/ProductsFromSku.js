import React from 'react';
import Papa from 'papaparse';
import Storage from "../../Storage";
import Loader from "../../Loader/Loader";
import Notifications, {notify} from 'react-notify-toast';

import './ProductsFromSku.css';

class ProductsFromSku extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            skuTextareaText: ""
        }
    }

    loadProducts = () => {
        if (this.state.skuTextareaText === "") {
            notify.show("You should input multiple SKUs", "error");
            return;
        }

        this.setState({
            isLoading: true
        });
        Papa.parse(this.state.skuTextareaText, {
            complete: (result) => {
                let cartId = Storage.getItem("cartId");
                let data = ` 
                    mutation {
                        addSimpleProductsToCart(
                            input: {
                                cart_id: "${cartId}"
                                cart_items: [
                                `;

                result.data.forEach((product) => {
                    data += `
                        {
                            data: {
                                quantity: ${product[1]}
                                sku: "${product[0]}"
                            }
                        }`;
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
                        })
                    });
            }
        });
    }

    skuTextareaChange = (e) => {
        this.setState({skuTextareaText: e.target.value});
    }

    render() {
        return (
            <div className="multipleProducts">
                <h1>Add Multiple Products</h1>
                <label className="inputLabel" htmlFor="sku">Enter multiple SKU(s)</label>
                <textarea cols="30" rows="3" id="sku" className="skuTextarea"
                          placeholder="Use new line for each separate SKU. Add just SKUs or also specify qty and options."
                          onChange={this.skuTextareaChange}/>
                <span className="comment">Format: SKU,qty</span>
                <span className="comment">Example: WT08,5</span>
                <div className="productFormButtonWrapper">
                    <button className="addToList" onClick={this.loadProducts}>Add to List</button>
                    {this.state.isLoading &&
                    <Loader/>}
                </div>
                <Notifications/>
            </div>
        )
    }
}

export default ProductsFromSku;
