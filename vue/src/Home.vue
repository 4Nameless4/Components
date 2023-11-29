<script setup lang="ts">
import Markdown from "./components/markdown/index.vue";
import md from "../README.md";
</script>
<template>
  <section
    class="full flex justify-center items-center bg-slate-800 text-slate-200 flex-col mb-8"
  >
    <h1 class="capitalize">Welcome</h1>
    <span class="capitalize">Here are vue study project by mzw!</span>
  </section>
  <Markdown :mdHTML="md"></Markdown>
</template>
