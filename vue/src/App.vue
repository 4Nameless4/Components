<script setup lang="ts">
import { ref } from "vue";
import routes from "./routes";
import { ElButton, ElMenu, ElMenuItem, ElIcon } from "element-plus";
import { RouterLink } from "vue-router";

const list: typeof routes = [];
routes.forEach((d, index) => {
  if (d.path === "/") return;
  let name = `Unkown-${index}`;
  if (typeof d.name === "string") {
    name = d.name;
  }
  list.push({
    ...d,
    name: name.charAt(0).toUpperCase() + name.slice(1),
  });
});

const isExpend = ref(false);
</script>

<template>
  <header>
    <a class="home ring-1 ring-blue-500/50">
      <el-icon>
        <router-link to="/"><House /></router-link>
      </el-icon>
    </a>
    <el-button class="menubtn" @click="isExpend = !isExpend">
      <el-icon>
        <Menu />
      </el-icon>
    </el-button>
  </header>
  <div class="page-wrapper">
    <div class="aside-group">
      <aside
        :class="{
          sidebar: true,
          expend: isExpend,
          'shadow-lg': true,
          'rounded-r-md': true,
        }"
      >
        <nav>
          <el-menu router @select="() => (isExpend = false)">
            <el-menu-item
              v-for="route in list"
              :key="route.name"
              :index="route.path"
            >
              {{ route.name }}
            </el-menu-item>
          </el-menu>
        </nav>
      </aside>
      <aside class="toc">
        <nav>
          <ul>
            <li class="click-able">1</li>
          </ul>
        </nav>
      </aside>
    </div>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component"></component>
        </Transition>
      </router-view>
    </main>
  </div>
  <footer></footer>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
}
aside {
  overflow: hidden;
  background-image: linear-gradient(
    45deg,
    #272727,
    rgb(215 212 212),
    rgb(199 210 223)
  );
}
nav {
  list-style: none;
}
header {
  --padding-content: 0.5rem;
  display: flex;
  justify-content: space-between;
  padding: var(--padding-content);
  background-image: linear-gradient(45deg, #efefef, #9ca5b5, #474545);
}
header .home {
  width: var(--header-size);
  height: var(--header-size);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
header .home:hover {
  cursor: pointer;
}
header .menubtn {
  width: var(--header-size);
  height: var(--header-size);
}
.page-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.main-content {
  height: 100%;
}
.aside-group {
  display: contents;
}
.sidebar,
.toc {
  position: fixed;
  top: calc(var(--header-size) + var(--padding-content));
  max-width: 20rem;
  width: 80vw;
  height: 100%;
}
.sidebar {
  transition: 0.3s linear;
  transform: translateX(-100%);
  will-change: transform;
}
.toc {
  width: 0;
  height: 0;
}
.sidebar.expend {
  transform: translateX(0);
}
@media screen and (min-width: 1000px) {
  .page-wrapper {
    display: flex;
  }
  .sidebar {
    position: sticky;
    left: 0;
    top: 0;
    transform: translateX(0);
  }
  .toc {
    position: sticky;
    right: 0;
    top: 0;
  }
  .main-content {
    flex: 1;
  }
  header .menubtn {
    display: none;
  }
}
</style>
