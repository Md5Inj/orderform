import React from 'react';
import ReactModal from 'react-modal';
import Papa from 'papaparse';

import Modal from "../../Modal/Modal";
import ProductStorage from "../../ProductStorage";

import './ProductsFromSku.css';
import Grid from "../../Grid/Grid";

class ProductsFromSku extends React.Component {
    constructor(props) {
        super(props);

        this.tableHeaders = [
            {
                title: "Item №",
                class: "item-number-head"
            },
            {
                title: "SKU",
                class: "sku-head"
            },
            {
                title: "Reason",
                class: "action-head"
            }
        ];

        this.modalButtons = [
            {
                text: 'Accept',
                class: 'btnOk',
                action: this.acceptAction
            },
            {
                text: 'Cancel',
                class: 'btnCancel',
                action: this.cancelAction
            }
        ];

        this.state = {
            showModal: false,
            skuTextareaText: "",
            modalContent: "",
            modalButtons: ""
        }
    }

    cancelAction = () => {
        this.handleCloseModal();
    }

    acceptAction = () => {
        this.state.response.items.forEach(product => {
            ProductStorage.addProduct(product);
        });

        this.handleCloseModal();
    }

    handleOpenModal = (params) => {
        let tableData = [];
        this.setState({
            response: params
        })

        Object.entries(params.errors).map(function(error, index) {
            tableData.push(
                <tr key={index+1}>
                    <td>{index+1}</td>
                    <td>{error[0]}</td>
                    <td className="errorMessage">{error[1]}</td>
                </tr>
            );
        });

        let modalContent =
            <div>
                <div className="modalTitle">
                    <p>{params.total - Object.entries(params.errors).length} out of {Object.entries(params.errors).length} </p>
                    <p>successfully passed validation</p>
                    <span>Items below will not be added to the grid because:</span>
                </div>
                <Grid
                    tableHeaders={this.tableHeaders}
                    tableData={tableData}
                />
            </div>

        let buttons = this.modalButtons.map(button => {
            return (
                <button className={button.class} onClick={button.action}>{button.text}</button>
            )
        });

        this.setState({
            showModal: true,
            modalContent: modalContent,
            tableData: tableData,
            modalButtons: buttons
        });
    }

    handleCloseModal = () => {
        this.setState({showModal: false});
    }

    loadProducts = () => {
        let formData = new FormData();
        Papa.parse(this.state.skuTextareaText, {
            complete: (result) => {
                formData.append("products", JSON.stringify(result.data));
                formData.append("form_key", this.props.formKey)

                fetch(this.props.loadFilesFromCsvUrl, {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.json())
                    .then((response) => {
                        if (response.errors.length === 0 && response.items.length !== 0) {
                            response.items.forEach(product => {
                                ProductStorage.addProduct(product);
                            });
                        } else {
                            this.handleOpenModal(response);
                        }
                    })
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
                    {this.state.showModal ?
                        <Modal
                            content={this.state.modalContent}
                            buttons={this.state.modalButtons}
                            handleCloseModal={this.handleCloseModal}
                        /> : null}
                </div>
            </div>
        )
    }
}

export default ProductsFromSku;
