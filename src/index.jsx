import 'babel-polyfill';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/main.scss';
import React from 'react';
import { render } from 'react-dom';
import App from './modules/app/App';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

let middlewares = [thunkMiddleware];
if(process.env.LOG_ACTIONS === 'true') {
  middlewares.push(createLogger());
}

const store = createStore(rootReducer, applyMiddleware.apply(this, middlewares));

// FIXME for development/debugging only
// window.STORE = store;

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
