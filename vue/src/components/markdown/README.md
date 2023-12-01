# Markdown Vue Component

- prop: mdHTML

> Pass in HTML format string;

> Eg: marked package format markdown string to HTML, then put in the `mdHTML` prop.

```vue
<script setup lang="ts">
import Markdown from "./index.vue";
import md from "./README.md";
</script>
<template>
  <section class="view">
    <Markdown :mdHTML="md"></Markdown>
  </section>
</template>
```

- prop: mdStr

> Pass in markdown format string;

> Eg: put markdown file string into the `mdStr` prop.

> The component is responsible for converting the markup format into HTML.

```vue
<script setup lang="ts">
import Markdown from "./index.vue";
const md = `# The Markdown`;
</script>
<template>
  <section class="view">
    <Markdown :mdHTML="md"></Markdown>
  </section>
</template>
```
