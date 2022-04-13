import { Graph } from "../src/Graph";
const a = new Graph();
console.log(a);
a.setData({
  nodes: [{ key: "1" }, { key: "2" }],
  links: [{ key: "1", source: 0, target: 1 }],
});
