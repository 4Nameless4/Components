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
    node.r = 100;
    node.fx = node.fy = 0;
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
  simulation.alpha(0.3);
}
</script>

<template>
  <Graph :data="graphData" force @pointermove="pointermove" ref="graph" />
</template>

<style scoped>
</style>
