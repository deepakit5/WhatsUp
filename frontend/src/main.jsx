import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./app/store.js";
// import AppRouter from "./router/AppRouter";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <AppRouter /> */}
    <App />
  </Provider>
);
