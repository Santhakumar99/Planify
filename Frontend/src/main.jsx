// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store }  from "./Store/store"
import { LoadingProvider } from "./Pages/CommonComponents/LoadingProvider.jsx";
import { ToastProvider } from "./Pages/CommonComponents/Toast/ToastProvider.jsx";
import { Provider } from "react-redux";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <StrictMode>
    <LoadingProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LoadingProvider>
    </StrictMode>
  </Provider>
);
