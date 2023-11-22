<script setup lang="ts">
import { ref } from "vue";
import { Graph, t_data_node } from "../components/index";
const nodes: t_data_node[] = [];
for (let i = 0; i < 500; i++) {
  const node: t_data_node = {
    id: "n" + i,
  };
  nodes.push(node);
  if (i === 0) {
    node.r = 200;
    node.fx = node.fy = 0;
    node.fill = "#00000000";
  }
}

const graphData = ref<any>({
  nodes: nodes,
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
function initNodeData(data: t_data_node, index: number) {
  if (data.id !== "n0") {
    return {
      text: String(index),
      r: 30,
    };
  }
  return;
}
</script>

<template>
  <Graph
    :data="graphData"
    force
    @pointermove="pointermove"
    ref="graph"
    :initNodeData="initNodeData"
  />
</template>
