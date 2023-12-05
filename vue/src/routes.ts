import { RouteRecordRaw } from "vue-router";
import Graph from "./components/graph/demo.vue";
import Markdown from "./components/markdown/demo.vue";
// import Test from "./components/test/index.vue";
import Home from "./Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    name: "home",
  },
  {
    path: "/graph",
    component: Graph,
    name: "graph",
  },
  {
    path: "/markdown",
    component: Markdown,
    name: "markdown",
  },
  // {
  //   path: "/test",
  //   component: Test,
  //   name: "test",
  //   props: (route) => ({
  //     q: route.query.q,
  //     aa: true,
  //     bb: false,
  //   }),
  // },
];
export default routes;
