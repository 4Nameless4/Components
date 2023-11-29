import { RouteRecordRaw } from "vue-router";
import Graph from "./components/graph/demo.vue";
import Test from "./components/test/index.vue";
import Home from "./Home.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/graph", component: Graph, name: "graph" },
  {
    path: "/test/:id",
    component: Test,
    name: "test",
    props: (route) => ({
      q: route.query.q,
      aa: true,
      bb: false,
    }),
  },
];
export default routes;
