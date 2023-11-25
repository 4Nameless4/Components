<script setup lang="ts">
import { ref } from "vue";
import Graph from "./components/graph/demo.vue";
import { ElButton, ElMenu, ElMenuItem, ElIcon } from "element-plus";

const components = [
  {
    demo: Graph,
    name: "Graph",
  },
];
const selected = ref<number | undefined>(undefined);
const isExpend = ref(false);
</script>

<template>
  <header>
    <div class="header">
      <a class="home">
        <el-icon> <House /> </el-icon>
      </a>
      <el-button class="menubtn" @click="isExpend = !isExpend">
        <el-icon> <Menu /> </el-icon
      ></el-button>
    </div>
  </header>
  <div class="page-wrapper">
    <div class="aside-group">
      <aside :class="{ sidebar: true, expend: isExpend }">
        <nav>
          <el-menu
            @select="
              (index) => {
                selected = Number(index);
                isExpend = false;
              }
            "
          >
            <el-menu-item
              v-for="(comp, index) in components"
              :key="comp.name"
              :index="String(index)"
              >{{ comp.name }}</el-menu-item
            >
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
    <main
      class="main-content"
      style="display: flex; justify-content: center; align-items: center"
    >
      <section class="full" v-if="selected != null">
        <component :is="components[selected].demo"></component>
      </section>
    </main>
  </div>
  <footer></footer>
</template>

<style scoped>
aside {
  overflow: hidden;
}
nav {
  list-style: none;
}
.header {
  --padding-content: 0.5rem;
  display: flex;
  justify-content: space-between;
  padding: var(--padding-content);
}
.header .home {
  width: var(--header-size);
  height: var(--header-size);
  border: 1px solid;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header .home:hover {
  cursor: pointer;
}
.header .menubtn {
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
  border: 1px solid black;
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
  border: 1px solid;
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
  .header .menubtn {
    display: none;
  }
}
</style>
