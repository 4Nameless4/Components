<script lang="ts">
import { computed, defineProps } from "vue";
import { marked } from "marked";
import "./github-markdown.css";
export type t_mzw_markdown_props = {
  mdHTML?: string;
  mdStr?: string;
};
export default {
  name: "MarkdownView",
};
</script>
<script setup lang="ts">
const props = defineProps<t_mzw_markdown_props>();

const _mdHTML = computed(() => {
  let html = props.mdHTML || "";
  if (!html && props.mdStr) {
    html = marked(props.mdStr)
  }
  return html;
});
</script>
<template>
  <article v-html="_mdHTML" class="markdown-body"></article>
</template>
<style></style>
