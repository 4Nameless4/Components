<script lang="ts">
import {
  computed,
  defineComponent,
  defineProps,
  reactive,
  ref,
  watch,
} from "vue";
import { autoSize, getID, randomColor } from "../common";
import {
  Force,
  Simulation,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3";

export interface t_props {
  data?: { nodes: t_data_node[]; links: t_data_link[] };
  initNodeData?: (props: {
    data: t_data_node;
    index: number;
  }) => Omit<Partial<t_node>, "id" | "data"> | void;
  initLinkData?: (props: {
    data: t_data_link;
    index: number;
    id: string;
  }) => Omit<Partial<t_link>, "id" | "data" | "source" | "target"> | void;
  force?: Force<t_node, t_link>[] | Boolean;
  zoomable?: boolean;
}

export interface t_data_node {
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
export interface t_data_link {
  id?: string;
  source: string;
  target: string;
  color?: string;
  width?: number;
}

export interface t_node extends Required<Omit<t_data_node, "fx" | "fy">> {
  fx?: number;
  fy?: number;
  data: t_data_node;
}
export interface t_link
  extends Required<Omit<t_data_link, "source" | "target">> {
  id: string;
  source: t_node;
  target: t_node;
  data: t_data_link;
}

export default defineComponent({
  name: "Graph",
});
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<t_props>(), {
  data: () => ({ nodes: [], links: [] }),
  force: () => true,
  zoomable: false,
});
// resize 动态改变svg的viewbox
const { elementRef: graphEl, widthRef, heightRef } = autoSize();

// 默认随机颜色函数
const nodeColor = randomColor();

// 初始化数据
function initData() {
  const nodes: Map<string, t_node> = new Map();
  const links: Map<string, t_link> = new Map();
  const gID = getID();

  console.info("*** init data ***");

  props.data.nodes.forEach((node: t_data_node, index) => {
    const id = gID(node.id, {
      suffix: "node",
      warn: (preid, id) =>
        `node data id duplicate: old[${preid}] --> new[${id}]`,
    });

    const init = props.initNodeData;
    const d = init && init({ data: node, index });

    nodes.set(id, {
      id: id,
      data: node,
      x: node.x || Math.random() * 1000 - 500,
      y: node.y || Math.random() * 1000 - 500,
      fx: node.fx,
      fy: node.fy,

      fill: node.fill || nodeColor(id) || "",
      borderColor: node.borderColor || "#000000",
      borderWidth: node.borderWidth || 0,
      text: node.text || "",
      r: node.r || 5,

      ...d,
    });
  });

  props.data.links.forEach((link: t_data_link, index) => {
    const id = gID(link.id || `${link.source}_${link.target}`, {
      suffix: "node",
      warn: (preid, id) =>
        `node data id duplicate: old[${preid}] --> new[${id}]`,
    });

    const src = nodes.get(link.source);
    const tar = nodes.get(link.target);

    const init = props.initLinkData;
    const d = init && init({ data: link, index, id });

    src &&
      tar &&
      links.set(id, {
        id: id,
        data: link,

        source: src,
        target: tar,

        color: "#000",
        width: 3,
        ...d,
      });
  });

  return reactive({
    nodes,
    links,
  });
}

const _data = computed(initData);

// force bind
let simulation: Simulation<t_node, t_link> | null = null as any;
let forceCount = 0;
function forceBind() {
  console.info("*** force bind ***");
  let forces = props.force;
  if (!forces && forces !== "") {
    if (simulation) {
      simulation.stop();
      simulation = null;
    }
    return;
  } else if (!Array.isArray(forces)) {
    forces = [
      forceCollide<t_node>().radius((d) => d.r + 5),
      forceManyBody<t_node>().strength((d) => d.r * -6),
      forceX(),
      forceY(),
      forceLink(Array.from(_data.value.links.values())),
    ];
  }
  simulation = simulation || forceSimulation();
  simulation.nodes(Array.from(_data.value.nodes.values()));

  // 卸载旧力
  for (let i = 0; i < forceCount; i++) {
    simulation.force(String(i), null);
  }

  // 挂载新力
  forces.forEach((f, index) => {
    simulation!.force(String(index), f);
    forceCount++;
  });
}

watch([_data, () => props.force], forceBind, { immediate: true });

const svgTransofrmProps = ref({
  scale: 1,
  x: 0,
  y: 0,
});
function zoom(event: WheelEvent) {
  const svg = graphEl.value;
  if (!props.zoomable || !svg) return;

  const {
    scale: oldScale,
    x: transformX,
    y: transformY,
  } = svgTransofrmProps.value;
  // 计算scale
  const newScale =
    oldScale +
    -event.deltaY *
      (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
      (event.ctrlKey ? 10 : 1);
  svgTransofrmProps.value.scale = Math.max(Math.min(newScale, 2), 0.5);

  const SVGRect = svg.getBoundingClientRect();
  const viewbox = [
    svg.viewBox.baseVal.x,
    svg.viewBox.baseVal.y,
    svg.viewBox.baseVal.width,
    svg.viewBox.baseVal.height,
  ];
  // zoom center 在屏幕坐标系下，需要缩放的中心点相对于svg左上角的偏移量
  const event2SVGOffsetPos = [
    event.clientX - SVGRect.x,
    event.clientY - SVGRect.y,
  ];
  // svg的viewbox与实际的width、height的比例
  // 为了换算出 缩放中心点（屏幕坐标系）在 svg 未缩放平移时对应的(svg坐标系)坐标
  const svgAutoSizeRatio = Math.max(
    viewbox[2] / SVGRect.width,
    viewbox[3] / SVGRect.height
  );

  // zoom 中心坐标（SVG坐标系，并且未transform时的坐标）
  const event2SVGPos = [
    event2SVGOffsetPos[0] * svgAutoSizeRatio,
    event2SVGOffsetPos[1] * svgAutoSizeRatio,
  ];

  // 补偿 svg translate的值（要求transform时translate在scale前面）
  // const event2SVGPosTransformOffset = [
  //   ( - event2SVGPos[0]) * (newScale - 1),
  //   ( - event2SVGPos[1]) * (newScale - 1),
  // ];
  svgTransofrmProps.value.x = event2SVGPos[0];
  svgTransofrmProps.value.y = event2SVGPos[1];
  // svgTransofrmProps.value.x = event2SVGPosTransformOffset[0];
  // svgTransofrmProps.value.y = event2SVGPosTransformOffset[1];

  console.log("offset:", event2SVGOffsetPos);
  console.log("ratio:", svgAutoSizeRatio);
  console.log("scale:", newScale);
  console.log(event2SVGPosTransformOffset);
}

const transform = computed(() => {
  const t = svgTransofrmProps.value;
  return `translate(${t.x},${t.y}) scale(${t.scale})`;
  // return `translate(0 0) scale(1)`;
});

defineExpose({
  _data,
  simulation,
  widthRef,
  heightRef,
});
</script>

<template>
  <svg class="graph" ref="graphEl" @wheel.passive="zoom">
    <g :transform="transform">
      <path
        class="link"
        v-for="link in _data.links"
        :d="`M${link[1].source.x},${link[1].source.y}L${link[1].target.x},${link[1].target.y}`"
        :key="link[1].id"
        :stroke="link[1].color"
        :stroke-width="link[1].width"
        fill="none"
      ></path>

      <g
        class="node"
        v-for="node in _data.nodes"
        :key="node[1].id"
        :transform="`translate(${node[1].x},${node[1].y})`"
      >
        <circle
          :r="node[1].r"
          :fill="node[1].fill"
          :stroke="node[1].borderColor"
          :stroke-width="node[1].borderWidth"
        ></circle>
        <text v-if="node[1].text">
          {{ node[1].text }}
        </text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.graph {
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.graph text {
  dominant-baseline: middle;
  alignment-baseline: middle;
  text-anchor: middle;
}
</style>
