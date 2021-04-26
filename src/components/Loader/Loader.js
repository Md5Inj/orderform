import React from 'react';

import './Loader.css';

class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="loader">
                <svg className="loaderImage">
                    <circle cx="70" cy="70" r="70"/>
                </svg>
            </div>
        );
    }
}

export default Loader;
