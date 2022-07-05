import { Graph, t_parse_node, t_partial_props } from "./src/index";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  Simulation,
  Selection,
  drag,
  zoom,
  scaleOrdinal,
  schemeCategory10,
} from "d3";

const colors = scaleOrdinal(schemeCategory10);

const graph = new Graph<any, any>();

const props: t_partial_props<any, any> = {
  node: {
    // radius: 10,
    color: "#34343434",
    opacity: 1,
    borderStyle: {
      color: "red",
      size: 3,
      opacity: 0.5,
      dashArray: "5, 8",
    },
    tspanStyle: [
      {
        color: "green",
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        // align: "left",
        // vAlign: "top",
        lengthAdjust: "spacing",
        textLength: 30,
        rotate: 45,
      },
      {
        color: "blue",
        x: 3,
        y: 2,
        dx: 4,
        dy: 1,
        // align: "right",
        // vAlign: "middle",
        lengthAdjust: "spacingAndGlyphs",
        textLength: 60,
        rotate: 60,
      },
    ],
  },
  link: {
    size: 1,
    color: "#23f3ff",
    opacity: 1,
  },
  nodeParse: (d) => {
    return {
      radius: 50,
      color: colors(d.key),
      opacity: 0.3,
      borderStyle: {
        color: "yellow",
        size: 20,
        opacity: 1,
        dashArray: "2",
      },
      tspanStyle: {
        color: "blue",
        // x: 0,
        // y: 0,
        // dx: 0,
        // dy: 0,
        align: "center",
        vAlign: "middle",
        // lengthAdjust: "spacing",
        // textLength: 100,
        // rotate: 10,
      },
    };
  },
  linkParse: (d) => {
    return {
      size: 1,
      color: colors(d.key),
      opacity: 1,
    };
  },
  switch: {
    dragable: true,
    zoomable: true,
    dragLock: true,
    linkPadable: true,
  },
  forceProps: {
    // alpha: 1,
    // alphaDecay: 0.001,
    // alphaMin: 0.2,
    // alphaTarget: 0.1,
    // velocityDecay: 0.02,
  },
  // forces: {
  //   x: 0.02,
  //   y: 0.02,
  //   manyBody: -1000,
  //   linkDistance: 400,
  //   linkStrength: 1,
  //   collide: 1,
  // },
  forces: (force, links) => {
    const viewBox = graph.getViewBox();
    force
      .force("forceX", forceX(viewBox[2] / 2).strength(0.02))
      .force("forceY", forceY(viewBox[3] / 2).strength(0.02))
      .force("forceManyBody", forceManyBody().strength(-1000))
      .force("forceLink", forceLink(links).distance(300).strength(1))
      .force(
        "forceCollide",
        forceCollide<t_parse_node<any, any>>()
          .radius((d) => d.props.radius)
          .strength(1)
      );
  },
  nodeCustom: (data: t_parse_node<any, any>, target: SVGGElement) => {
    select(target)
      .selectAll("for")
      .data([data])
      .join("foreignObject")
      .selectAll("div")
      .data((d) => [d])
      .join("xhtml:div")
      .text("test");
  },
  marker: "arrow",
  // marker: (data: t_parse_link<any, any>) =>
  //   document.createElementNS("http://www.w3.org/2000/svg", "marker"),
};

const data = {
  nodes: [
    { key: "1", text: ["node1", "node1-1", "node1-2"] },
    { key: "2", text: ["node2", "node2-1", "node2-2"] },
    { key: "3", text: ["node3", "node3-1", "node3-2"] },
    { key: "4", text: ["node4", "node4-1", "node4-2"] },
    { key: "5", text: ["node5", "node5-1", "node5-2"] },
  ],
  links: [
    { key: "1", source: 0, target: 1 },
    { key: "2", source: 2, target: 4 },
    { key: "3", source: 1, target: 4 },
  ],
};

graph.set({
  props: props,
  data: data,
});

const root = document.body.querySelector("#root");

graph.draw();

root!.appendChild(graph);

(window as any).graph = graph;
