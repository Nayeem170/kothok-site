import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TemplatePreview } from "./TemplatePreview";
import "./styles/globals.css";

const isTemplatePreview = new URLSearchParams(window.location.search).has("templates");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isTemplatePreview ? <TemplatePreview /> : <App />}
  </React.StrictMode>
);
