import { createRouter, createWebHashHistory } from "vue-router";
import But from "./components/button/demo.vue";
import Graph from "./components/graph/demo.vue";

const routes = [
  { path: "/", component: Graph },
  { path: "/bbb", component: But },
  {
    path: "/aaa",
    component: {
      template: "<div>aaa</div>",
      setup() {
        return {};
      },
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
