import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorDialogsProvider from './Providers/ErrorDialogsProvider.jsx';
import { BrowserRouter } from "react-router-dom"
import UserProvider from './Providers/UserProvider.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserProvider>
    <ErrorDialogsProvider>
      <App />
    </ErrorDialogsProvider>
  </UserProvider>
  </BrowserRouter>
)
