<script setup lang="ts">
import { computed, defineProps, defineComponent } from "vue";
import "highlight.js/lib/common";
// import hljsVuePlugin from "@highlightjs/vue-plugin";
import { marked } from "marked";
import "github-markdown-css/github-markdown.css";
import 'highlight.js/styles/stackoverflow-light.css'

export type t_mzw_markdown_props = {
  mdHTML?: string;
  mdStr?: string;
};

const props = defineProps<t_mzw_markdown_props>();

const _mdHTML = computed(() => {
  let html = props.mdHTML || "";
  if (!html && props.mdStr) {
    html = marked(props.mdStr);
  }
  return html;
});
</script>
<script lang="ts">
export default defineComponent({
  name: "MarkdownView",
});
</script>
<template>
  <!-- <highlightjs language="js" code="console.log('Hello World');" /> -->
  <article v-html="_mdHTML" class="markdown-body"></article>
</template>
<style></style>
