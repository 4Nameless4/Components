<script setup lang="ts">
import { ref } from "vue";
import Graph from "./demos/Graph.vue";

const components = [Graph];
const selected = ref<number | undefined>(undefined);
function click(index: number) {
  selected.value = index;
}
</script>

<template>
  <header></header>
  <div class="page-wrapper">
    <div class="aside-group">
      <aside class="sidebar">
        <nav>
          <ul>
            <li
              class="click-able"
              v-for="(comp, index) in components"
              :key="comp.__name"
              @click="click(index)"
            >
              {{ comp.__name }}
            </li>
          </ul>
        </nav>
      </aside>
      <aside class="toc">
        <nav>
          <ul>
            <li class="click-able">1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </nav>
      </aside>
    </div>
    <main class="main-content">
      <section class="full" v-if="selected != null">
        <component :is="components[selected]"></component>
      </section>
    </main>
  </div>
  <footer></footer>
</template>

<style scoped>
.main-content {
  height: calc(100vh - 2 * var(--app-padding));
  border: 1px solid black;
}
.aside-group {
  display: contents;
}
.page-wrapper {
  display: grid;
  grid-template-areas: "sidebar main toc";
  grid-template-columns: minmax(0, 1fr) minmax(300px, 1200px) minmax(0, 1fr);
}
.sidebar {
  grid-area: sidebar;
}
.main-content {
  grid-area: main;
}
.toc {
  grid-area: toc;
}
ul {
  list-style: none;
}
.sidebar li {
  background: #c9c9c9;
}
@media screen and (min-width: 1200px) {
  /* .main-content {
    width: 1200px;
  } */
}
</style>
