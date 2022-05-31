import { Graph } from "../src/Graph";
import Demo from "./Demo";
import { scaleOrdinal, schemeCategory10 } from "d3";

const colors = scaleOrdinal(schemeCategory10);

const graph = new Graph<any, any>();
graph.set({
  props: {
    node: { radius: 10 },
    nodeParse: (d) => {
      return {
        color: colors(d.key),
      };
    },
    switch: {
      dragable: true,
    },
  },
  data: {
    nodes: [{ key: "1" }, { key: "2" }],
    links: [{ key: "1", source: 0, target: 1 }],
  },
});
// graph.draw();
// graph.dragOn();

const demo = new Demo();
demo.setComponent(graph);
demo.draw();
