import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root"));

// This is the START of Flow Architecture:
// index.js → App → Components → Dispatch → Store → Back to Components
root.render(
    <App />
);
