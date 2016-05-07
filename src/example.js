import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Example from './example/Example';
import './base.css';

const DOM_APP_EL_ID = 'app';

// Render the router
ReactDOM.render((
    <Example/>
), document.getElementById(DOM_APP_EL_ID));