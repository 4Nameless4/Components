<script lang="ts">
export default {
  name: "Markdown-Demo",
};
</script>
<script setup lang="ts">
import Markdown from "./index.vue";
import md from "./README.md";
</script>
<template>
  <section class="view">
    <Markdown :mdHTML="md"></Markdown>
  </section>
</template>
<style scoped>
section {
  margin: 0;
  background-image: none;
}
</style>
