import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { StoreProvider } from './Store'
import axios from 'axios'

axios.defaults.baseURL = 'https://api-mern-ecommerce.onrender.com'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
)

reportWebVitals()
