import Graph from "./components/graph/demo.vue";
import Home from "./Home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/graph", component: Graph, name: "graph" },
];
export default routes;
