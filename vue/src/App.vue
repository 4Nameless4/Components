<script setup lang="ts">
import { ref } from "vue";
import Graph from "./demos/Graph.vue";

const components = [Graph];
const selected = ref<number | undefined>(undefined);
function click(index: number) {
  if (selected.value === index) {
    selected.value = undefined;
  } else {
    selected.value = index;
  }
}
</script>

<template>
  <header>
    <div class="header">
      <a class="home"><img src="" /></a>
      <button class="option"></button>
    </div>
  </header>
  <div class="page-wrapper">
    <!-- <div class="aside-group">
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
          </ul>
        </nav>
      </aside>
    </div> -->
    <main class="main-content">
      <!-- <section class="full" v-if="selected != null">
        <component :is="components[selected]"></component>
      </section> -->
    </main>
  </div>
  <footer></footer>
</template>

<style scoped>
aside {
  overflow: hidden;
}
ul {
  list-style: none;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}
.header .home {
  width: var(--header-size);
  height: var(--header-size);
}
.header .option {
  width: var(--header-size);
  height: var(--header-size);
}
.page-wrapper {
  flex: 1;
  overflow: hidden;
}
.main-content {
  height: 100%;
  border: 1px solid black;
}
.aside-group {
  /* display: contents; */
}
/* .page-wrapper {
  position: relative;
  display: grid;
  grid-template-areas: "sidebar main toc";
  grid-template-columns: minmax(0, 1fr) minmax(0, 5fr) minmax(0, 1fr);
} */
.sidebar {
  /* grid-area: sidebar; */
  width: 0;
}
/* .main-content {
  grid-area: main;
} */
.toc {
  /* grid-area: toc; */
  width: 0;
}
/* .sidebar li {
  background: #c9c9c9;
} */
/* .toc li {
  background: #c9c9c9;
} */
@media screen and (min-width: 800px) {
  /* .sidebar {
    position: sticky;
    left: 0;
    top: 0;
  }
  .toc {
    position: sticky;
    right: 0;
    top: 0;
  } */
}
</style>
