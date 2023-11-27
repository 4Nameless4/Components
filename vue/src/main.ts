import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from "./router";

// 5. 创建并挂载根实例
const app = createApp(App);
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");

// 现在，应用已经启动了！
