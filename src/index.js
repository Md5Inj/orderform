import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const reactApp = function(){
    return {
        init(element, config) {
            return ReactDOM.render(<App config={config}/>, document.getElementById(element));
        }
    }
}

define(reactApp);
