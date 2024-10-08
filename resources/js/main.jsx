import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { Provider } from 'react-redux';
import store from './redux/index';

ReactDOM.createRoot(document.getElementById('app')).render(
    // <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
    // </React.StrictMode>,
)
