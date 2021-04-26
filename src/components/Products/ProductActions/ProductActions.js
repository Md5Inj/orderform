import React from 'react';
import Storage from "../../Storage";
import Notifications, {notify} from "react-notify-toast";
import Loader from "../../Loader/Loader";

import './ProductActions.css';

class ProductActions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    addToCart = () => {
        let formData = new FormData();
        let maskedCartId = Storage.getItem("cartId");
        let getCartIdUrl = this.props.getCartIdUrl + maskedCartId.replaceAll("\"", "");

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
                        notify.show(error.message, 'error');
                    })
                } else {
                    let cartId = response.id;
                    formData.append("cartId", cartId);
                    formData.append("maskedCartId", cartId);

                    fetch(this.props.addToCartUrl, {
                        method: "POST",
                        body: formData
                    })
                        .then((response) => {
                            if (response.redirected) {
                                window.location.href = response.url;
                            }
                            this.setState({
                                isLoading: false
                            });
                            localStorage.removeItem("cartId");
                        });
                }
            });
    }

    render() {
        return (
            <div className="productActions">
                <button className="AddToCart" onClick={this.addToCart}>Add to cart</button>
                {this.state.isLoading &&
                <Loader/>}
                <Notifications/>
            </div>
        )
    }
}

export default ProductActions;
