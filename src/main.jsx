import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { makeServer } from "./mirage/server";
import "./index.css";

// Initialize Mirage server for both development and production
makeServer({ environment: process.env.NODE_ENV || "development" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
