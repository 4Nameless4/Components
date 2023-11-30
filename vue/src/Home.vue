<script setup lang="ts">
import Markdown from "./components/markdown/index.vue";
import md from "../README.md";
</script>
<template>
  <section class="view flex justify-center items-center flex-col gap-4">
    <h3 class="capitalize"><strong>Welcome!</strong></h3>
    <span class="capitalize"
      >Here are vue study project of <em>4Nameless4</em></span
    >
  </section>
  <Markdown :mdHTML="md"></Markdown>
</template>
<style scoped>
strong {
  font-size: 2rem;
  background-image: linear-gradient(315deg, #333333, #4e7b89, #63a9ff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
span {
  margin-top: 2rem;
}
</style>
