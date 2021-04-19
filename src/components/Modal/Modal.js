import React from 'react';

import './Modal.css';

class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modalWindow">
                <div className="modalContent">
                    <span className="close" onClick={this.props.handleCloseModal}>&times;</span>
                    {this.props.content !== undefined ? this.props.content : ""}
                    <div className="actions">
                        {this.props.buttons !== undefined ? this.props.buttons : "" }
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;
