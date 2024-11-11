import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorDialogsProvider from './Providers/ErrorDialogsProvider.jsx';
import { BrowserRouter } from "react-router-dom"
import MapProvider from './Providers/MapProvider.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorDialogsProvider>
      <MapProvider>
        <App />
      </MapProvider>
    </ErrorDialogsProvider>
  </BrowserRouter>
)
