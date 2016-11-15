import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import '../node_modules/font-awesome/css/font-awesome.css';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
