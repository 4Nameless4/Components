<script setup lang="ts">
import Markdown from "./components/markdown/index.vue";
import md from "../README.md";

</script>
<script lang="ts">
export default {
  name: "Home",
};
</script>
<template>
  <section class="view flex justify-center items-center flex-col gap-4">
    <h3 class="capitalize"><strong>Welcome!</strong></h3>
    <span class="capitalize"
      >Here are vue study project of <em><a href="https://github.com/4Nameless4/Components/tree/main/vue">4Nameless4</a></em></span
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
