import { Graph } from "../src/Graph";
import Demo from "./Demo";
const a = new Graph();

const root = document.querySelector("#root");

root && root.appendChild(a);

a.setData({
  nodes: [{ key: "1" }, { key: "2" }],
  links: [{ key: "1", source: 0, target: 1 }],
});

a.draw();

export const Graph2Demo = "Graph2Demo";
