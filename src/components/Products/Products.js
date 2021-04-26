import React from 'react';
import ProductActions from "./ProductActions/ProductActions";
import Grid from "../Grid/Grid";
import Totals from "../Totals/Totals";
import Loader from "../Loader/Loader";
import Storage from "../Storage";
import Notifications, {notify} from "react-notify-toast";

import './Products.css';


class Products extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            tableData: <div/>,
            totalPrice: 0,
            isLoading: false,
            qtyUpdateRunning: false,
            timer: undefined,
            errors: []
        };

        this.tableHeaders = [
            {
                title: "Item",
                class: "item-head"
            },
            {
                title: "Qty",
                class: "qty-head"
            },
            {
                title: "Action",
                class: "action-head"
            }
        ];

        window.addEventListener('productsOperation', () => {
            this.processData();
        });

        window.addEventListener('quantityUpdateError', () => {
            this.renderTableData();
        });

        this.show = notify.createShowQueue();
    }

    processData = () => {
        let cartId = Storage.getItem("cartId");
        let data = `
        {
            cart(cart_id: "${cartId}") {
                items {
                    id
                    product {
                        name
                        sku
                    }
                quantity
                }
                
                prices {
                    grand_total {
                        value
                        currency
                    }
                }
            }
        }`;

        if (!this.state.qtyUpdateRunning) {
            this.setState({
                isLoading: true
            });
        }

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
                if (response.errors === undefined) {
                    let products = response.data.cart.items;
                    let totalPrice = response.data.cart.prices.grand_total.value;
                    let qtyUpdateRunning = this.state.qtyUpdateRunning ? false : this.state.qtyUpdateRunning;

                    this.setState({
                        products: products,
                        totalPrice: totalPrice,
                        qtyUpdateRunning: qtyUpdateRunning
                    }, () => {
                        this.renderTableData();
                        this.setState({
                            isLoading: false
                        });
                    });
                }
                this.setState({
                    isLoading: false
                });
            });
    }

    closeProductError = (e) => {
        e.preventDefault();

        let sku = e.target.dataset.sku;
        let errors = this.state.errors;

        if (this.state.errors[sku] !== undefined) {
            delete errors[sku];

            this.setState({
                errors: errors
            });

            window.dispatchEvent(new Event('quantityUpdateError'));
        }
    }

    renderTableData = () => {
        let tableData;

        if (this.state.products.length !== 0) {
            tableData = this.state.products.map(product => {
                return (
                    <div className="tr" data-product-id={product.id} key={product.id}>
                        <div className="td">{product.product.sku}</div>
                        <div className="td">
                            <button className="qty minus" onClick={this.updateProductQty}/>
                            <input type="number" min="1" className="qtyInput" value={product.quantity}
                                   onChange={this.updateProductQty}/>
                            <button className="qty plus" onClick={this.updateProductQty}/>
                        </div>
                        <div className="td"><span onClick={this.deleteProduct} className="productDelete">Delete</span></div>

                        {this.state.errors[product.product.sku] !== undefined &&
                            <span className="productError">
                                {this.state.errors[product.product.sku]}
                                <a href="#" className="close" data-sku={product.product.sku} onClick={this.closeProductError}>×</a>
                            </span>
                        }
                    </div>
                );
            });
        }

        this.setState({
            tableData: tableData
        });
    }

    deleteProduct = (e) => {
        let id = +e.target.closest(".tr").dataset.productId;
        let cartId = Storage.getItem("cartId");

        if (this.state.products !== undefined && this.state.products.length === 1) {
            let formData = new FormData();
            let getCartIdUrl = this.props.getCartIdUrl + cartId;

            formData.append("form_key", this.props.formKey);

            this.setState({
                isLoading: true
            });
            fetch(getCartIdUrl, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.errors !== undefined && response.errors.length !== 0) {
                        response.errors.forEach(error => {
                            this.show(error.message, 'error');
                        })
                    } else {
                        let cartId = response.id;
                        formData.append("cartId", cartId);

                        fetch(this.props.clearCartUrl, {
                            method: "POST",
                            body: formData
                        })
                            .then((response) => {
                                this.setState({
                                    isLoading: false,
                                    products: []
                                });
                                window.dispatchEvent(new Event('productsOperation'));
                            });
                    }
                });
        } else {
            let data = `
        mutation {
            removeItemFromCart(
                input: {
                  cart_id: "${cartId}",
                  cart_item_id: ${id}
                }
            )
        {
            cart {
                items {
                    id
                    product {
                        name
                    }
                    quantity
                }
                prices {
                    grand_total {
                        value
                        currency
                    }
                }
            }
        }}`;

            this.setState({isLoading: true});

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
                            this.show(error.message, 'error');
                        });
                    }

                    window.dispatchEvent(new Event('productsOperation'));
                });
        }
    }

    updateProductQty = (e) => {
        let cartId = Storage.getItem("cartId");

        let tr = e.target.closest(".tr");
        let productId = +tr.dataset.productId;
        let qty = tr.getElementsByTagName('input')[0].value;
        if (e.target.classList.contains("minus")) {
            if (qty > 1) {
                qty = +(qty) - 1;
            }
        } else if (e.target.classList.contains("plus")) {
            qty = +(qty) + 1;
        } else {
            if (e.target.value === "") {
                qty = 1;
            } else {
                qty = e.target.value;
            }
        }

        let products = this.state.products.map(product => {
            if (+(product.id) === productId) {
                product.quantity = qty;
            }

            return product;
        });

        this.setState({
            products: products
        }, () => {
            this.renderTableData();
        });

        if (this.state.timer !== undefined) {
            clearInterval(this.state.timer);
        }

        this.setState({
            qtyUpdateRunning: true,
            timer: setTimeout(() => {
                this.updateProductQtyQuery(cartId, productId, qty);
            }, 500)
        });
    }

    updateProductQtyQuery = (cartId, productId, qty) => {
        let data = `
            mutation {
                updateCartItems(
                    input: {
                        cart_id: "${cartId}",
                        cart_items: [
                            {
                                cart_item_id: ${productId}
                                quantity: ${qty}
                            }
                        ]
                    }
                )
            {
                cart {
                    items {
                        id
                    }
                }
            }}`;

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
                        let sku = error.message.match("(?<=SKU ).+?(?=:)");
                        this.showQtyError(sku, error.message);
                    });
                }

                window.dispatchEvent(new Event('productsOperation'));
            });
    }

    showQtyError = (sku, errorMessage) => {
        let errors = this.state.errors;
        errors[sku] = errorMessage;

        this.setState({
            errors: errors
        }, () => {
            window.dispatchEvent(new Event('quantityUpdateError'));
        });
    }

    componentDidMount() {
        if (Storage.getItem("cartId") !== null) {
            this.processData();
        }
    }

    render() {
        let productsElement;
        let totals;

        if (this.state.products.length !== 0) {
            productsElement =
                <Grid
                    tableHeaders={this.tableHeaders}
                    tableData={this.state.tableData}
                />
            totals =
                <Totals
                    currencySymbol={this.props.currencySymbol}
                    totalPrice={this.state.totalPrice}
                />

        } else {
            productsElement =
                <div className="noProducts">
                    <span>You haven’t added products yet.</span>
                </div>;
        }

        return (
            <div className="productListWrapper">
                <div className="productList">
                    {productsElement}
                    {totals}
                </div>
                <ProductActions
                    addToCartUrl={this.props.addToCartUrl}
                    getCartIdUrl={this.props.getCartIdUrl}
                    formKey={this.props.formKey}
                />
                {this.state.isLoading &&
                <Loader/>}
                <Notifications/>
            </div>
        )
    }
}

export default Products;
