import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <ToastContainer position="top-right" theme="light" limit={1}/>
      <App />
    </StrictMode>
  </Provider>
);
