import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AppRoute} from 'routes/App.route';
import "./index.css";
import store from './redux/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <AppRoute/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

