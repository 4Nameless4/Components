import { Graph } from "../src/Graph";
import Demo from "./Demo";

const graph = new Graph();

graph.setData({
  nodes: [{ key: "1" }, { key: "2" }],
  links: [{ key: "1", source: 0, target: 1 }],
});

const demo = new Demo();
demo.setComponent(graph);

demo.draw();
