import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ApiProvider from './context/ContextProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApiProvider>
            <App />
        </ApiProvider>
    </React.StrictMode>,
)
