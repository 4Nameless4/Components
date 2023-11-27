<script setup lang="ts">
import { ref } from "vue";
import Graph, { t_data_node } from "./index.vue";
import { randomColor } from "../common";
const nodes: t_data_node[] = [];
for (let i = 0; i < 2; i++) {
  const node: t_data_node = {
    id: "n" + i,
  };
  nodes.push(node);
  if (i === 0) {
    node.r = 6;
    node.fx = 0;
    node.fy = 0;
    node.fill = "#000000";
  }
}

const graphData = ref<any>({
  nodes: [
    { id: "n1", r: 5, fx: 300, fy: 300, fill: "#000" },
    { id: "n2", r: 5, fx: 500, fy: 500 },
    { id: "n3", r: 5, fx: 0, fy: 0 },
  ],
  links: [],
});

const graph = ref<null | InstanceType<typeof Graph>>(null);
function pointermove(e: PointerEvent) {
  const graphInstance = graph.value;
  if (!graphInstance) return;
  const node = graphInstance._data.nodes.get("n0");
  const simulation = graphInstance.simulation;
  if (!node || !simulation) return;
  node.fx = e.offsetX - graphInstance.widthRef / 2;
  node.fy = e.offsetY - graphInstance.heightRef / 2;
  simulation.alpha(0.3).restart();
}
// 为了测试硬加的参数
function initNodeData({ data }: { data: t_data_node }) {
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
  name: "GraphDemo",
};
</script>

<template>
  <Graph
    :data="graphData"
    force
    @pointermove="pointermove"
    ref="graph"
    :initNodeData="initNodeData"
    :initLinkData="initLinkData"
    zoomable
  />
</template>
