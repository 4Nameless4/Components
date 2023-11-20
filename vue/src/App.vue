<script setup lang="ts">
import Graph from "./demos/Graph.vue";
</script>

<template>
  <header></header>
  <main>
    <aside>
      <nav><ul></ul></nav>
    </aside>
    <section class="demoViewPort">
      <Graph />
    </section>
  </main>
  <footer></footer>
</template>

<style scoped>
.demoViewPort {
  height: calc(100vh - 2 * var(--app-padding));
  width: 1200px;
  border: 1px solid black;
}
</style>
