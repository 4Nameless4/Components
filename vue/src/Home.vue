<script setup lang="ts">
import Markdown from "./components/markdown/index.vue";
import md from "../README.md";
console.log(md);
</script>
<template>
  <section><h3>Welcome my componets project!</h3></section>
  <Markdown :md="md"></Markdown>
</template>
