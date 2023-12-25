import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Router } from "./react-router";
import type { t_routes } from "./router";
import GraphDemo from "./graph/demo";
import "./style.css";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/stackoverflow-light.css";

const routes: t_routes = {
  graph: {
    name: "Graph",
    page: GraphDemo,
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router routes={routes}>
      <App />
    </Router>
  </StrictMode>
);
