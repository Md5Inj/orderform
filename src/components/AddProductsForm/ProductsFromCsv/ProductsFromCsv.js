import React from 'react';

import './ProductsFromCsv.css';
import ProductStorage from "../../ProductStorage";
import Papa from "papaparse";
import Modal from "../../Modal/Modal";
import Grid from "../../Grid/Grid";

class ProductsFromCsv extends React.Component {
    constructor(props) {
        super(props);
        this.defaultInputText = "Choose file +";

        this.state = {
            fileInputLabel: this.defaultInputText,
            uploadedFile: "",
            showModal: false,
            modalContent: "",
            modalButtons: ""
        }

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

    importFromCsv = () => {
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

export default ProductsFromCsv;
