import React from "react";
import ReactDOM from "react-dom/client";
import "@picocss/pico/css/pico.min.css";
import "../app/globals.css";
import { CreatorApp } from "../app/CreatorApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CreatorApp initialPath={window.location.pathname} />
  </React.StrictMode>,
);
