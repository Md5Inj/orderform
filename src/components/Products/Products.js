import React from 'react';
import ProductActions from "./ProductActions/ProductActions";
import Grid from "../Grid/Grid";
import ProductStorage from "../ProductStorage";
import Totals from "../Totals/Totals";

import './Products.css';

class Products extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            tableData: <div/>,
            totalPrice: 0
        }

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

        window.addEventListener('storage', () => {
            this.processData();
        });
    }

    processData = () => {
        let products = ProductStorage.getProducts();
        let totalPrice = 0;
        products.forEach(product => {
           totalPrice += (+product.price * +product.quantity);
        });

        this.setState({
            products: products,
            totalPrice: totalPrice
        }, () => {
            this.renderTableData();
        });
    }

    renderTableData = () => {
        let tableData;
        console.log("Table data render");

        if (this.state.products.length !== 0) {
            tableData = this.state.products.map(product => {
                return (
                    <tr data-id={product.id} data-product-id={product.product_id}>
                        <td>{product.SKU}</td>
                        <td>
                            <button className="qty minus" onClick={this.updateProductQty}/>
                            <input type="number" min="1" className="qtyInput" value={product.quantity} onChange={this.updateProductQty}/>
                            <button className="qty plus" onClick={this.updateProductQty}/>
                        </td>
                        <td><span onClick={this.deleteProduct} className="productDelete">Delete</span></td>
                    </tr>
                );
            });
        }

        this.setState({
            tableData: tableData
        });
    }

    deleteProduct = (e) => {
        let id = +e.target.closest("tr").dataset.id;

        ProductStorage.deleteProduct(id);
    }

    updateProductQty = (e) => {
        let id = +e.target.closest("tr").dataset.id;
        let product = ProductStorage.getProduct(id);

        if (e.target.classList.contains("minus")) {
            if (product.quantity > 1) {
                product.quantity = +(product.quantity) - 1;
            }
        } else if (e.target.classList.contains("plus")) {
            product.quantity = +(product.quantity) + 1;
        } else {
            product.quantity = e.target.value;
        }

        ProductStorage.replaceProduct(id, product);
    }

    componentDidMount() {
        this.processData();
        this.renderTableData();
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
                <ProductActions/>
            </div>
        )
    }
}

export default Products;
