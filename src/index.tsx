import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CreditsProvider } from "./lib/credits";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CreditsProvider>
      <App />
    </CreditsProvider>
  </React.StrictMode>
);
