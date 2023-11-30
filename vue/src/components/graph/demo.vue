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
// 为了测试硬加的参数
function initNodeData({ data }: { data: t_mzw_data_node }) {
  if (data.id !== "n0") {
    return {
      r: 30,
    };
  }
  return;
}
// 为了测试硬加的参数
// 默认随机颜色函数
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
