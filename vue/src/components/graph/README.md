```vue
<script setup lang="ts">
import { ref } from "vue";
import Graph, { t_mzw_data_link, t_mzw_data_node } from "./index.vue";
import { randomColor, svgPointerInvert } from "../common";
import md from "./README.md";
import { Markdown } from "..";

const nodes: t_mzw_data_node[] = [];
const links: t_mzw_data_link[] = [];
for (let i = 0; i < 500; i++) {
  const node: t_mzw_data_node = {
    id: "n" + i,
  };
  nodes.push(node);
  if (i === 0) {
    node.r = 200;
    node.fx = 0;
    node.fy = 0;
    node.fill = "#00000000";
  }
}

const graphData = ref<any>({
  nodes,
  links,
});

const graph = ref<null | InstanceType<typeof Graph>>(null);
function pointermove(e: PointerEvent) {
  const graphInstance = graph.value;
  if (!graphInstance) return;
  const node = graphInstance._data.nodes.get("n0");
  const simulation = graphInstance.simulation;
  const svg = graphInstance.graphEl;
  const transformEL = graphInstance.transformEL;
  if (!node || !simulation || !svg || !transformEL) return;
  let { svgPointerTransform: p } = svgPointerInvert({
    clientPos: [e.clientX, e.clientY],
    svg,
    transformEL,
  });

  node.fx = p[0];
  node.fy = p[1];
  simulation.alpha(0.3).restart();
}
function initNodeData({ data }: { data: t_mzw_data_node }) {
  if (data.id !== "n0") {
    return {
      r: 30,
    };
  }
  return;
}
const linkColor = randomColor();
function initLinkData({ index }: { index: number }) {
  return {
    color: linkColor(index),
  };
}
</script>
<script lang="ts">
export default {
  name: "Graph-Demo",
};
</script>

<template>
  <section class="view">
    <Graph
      :data="graphData"
      force
      @pointermove="pointermove"
      ref="graph"
      :initNodeData="initNodeData"
      :initLinkData="initLinkData"
      zoompan
    />
  </section>
  <Markdown :mdHTML="md"></Markdown>
</template>
```

# Graph Vue Component

Visualizing for relation data.

> This vue component Implementing with SVG. So Difficulty in performance optimization.
>
> > Because The component dynamically update the DOM. Inevitably requires JavaScript to create and cache virtual DOM.

## technology

[D3.js force algorithm](https://github.com/d3/d3-force)

## Properties

| Propertiy Name | Description                                                               | Type                                      |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| data           | node\link relation data object                                            | { nodes: node{}[]; links: link{}[] }      |
| initNodeData   | node properties getter callback                                           | (node) => (nodeStyles{} / void)           |
| initLinkData   | link properties getter callback                                           | (link) => (linkStyles{} / void)           |
| force          | Force simulation function turn on;Default: true;Or Custom Force algorithm | Force<t_mzw_node, t_mzw_link>[] / Boolean |
| zoompan        | zoompan feature turn on;Default: false                                    | boolean                                   |

```typescript
interface t_mzw_graph_props {
  data?: { nodes: t_mzw_data_node[]; links: t_mzw_data_link[] };
  initNodeData?: (props: {
    data: t_mzw_data_node;
    index: number;
  }) => Omit<Partial<t_mzw_node>, "id" | "data"> | void;
  initLinkData?: (props: {
    data: t_mzw_data_link;
    index: number;
    id: string;
  }) => Omit<Partial<t_mzw_link>, "id" | "data" | "source" | "target"> | void;
  force?: Force<t_mzw_node, t_mzw_link>[] | Boolean;
  zoompan?: boolean;
}

interface t_mzw_data_node {
  id: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  fill?: string;
  borderColor?: string;
  borderWidth?: number;
  text?: string;
  r?: number;
}
interface t_mzw_data_link {
  id?: string;
  source: string;
  target: string;
  color?: string;
  width?: number;
}

interface t_mzw_node extends Required<Omit<t_mzw_data_node, "fx" | "fy">> {
  fx?: number;
  fy?: number;
  data: t_mzw_data_node;
}
interface t_mzw_link
  extends Required<Omit<t_mzw_data_link, "source" | "target">> {
  id: string;
  source: t_mzw_node;
  target: t_mzw_node;
  data: t_mzw_data_link;
}
```
