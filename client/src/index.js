import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter } from 'react-router-dom';
import store from './redux/store'
import { Provider } from 'react-redux'
import NotificationProvider from './context/NotificationProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter >
    <NotificationProvider>
    <Provider store={store}>
    <App /> 

    </Provider>
    </NotificationProvider>
    </BrowserRouter>
);

