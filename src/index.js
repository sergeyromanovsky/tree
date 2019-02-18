import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './pages';

// disable browser event on mouse right click
window.onload = function() {
    document.addEventListener(
        'contextmenu',
        function(e) {
            e.preventDefault();
        },
        false
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
