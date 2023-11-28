<script lang="ts">
import { defineProps } from "vue";
export type t_mzw_markdown_props = {
  md: string;
};
export default {
  name: "MarkdownView",
};
</script>
<script setup lang="ts">
defineProps<t_props>();
</script>
<template>
  <article v-html="md"></article>
</template>
<style></style>
