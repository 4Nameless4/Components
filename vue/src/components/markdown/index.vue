<script setup lang="ts">
import { computed, defineProps, defineComponent } from "vue";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/stackoverflow-light.css";

export type t_mzw_markdown_props = {
  mdHTML?: string;
  mdStr?: string;
};

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code) {
      return hljs.highlightAuto(code).value;
    },
  })
);

const props = defineProps<t_mzw_markdown_props>();

const _mdHTML = computed(() => {
  let html = props.mdHTML || "";
  if (!html && props.mdStr) {
    html = marked.parse(props.mdStr).toString();
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
  <article v-html="_mdHTML" class="markdown-body"></article>
</template>
<style></style>
