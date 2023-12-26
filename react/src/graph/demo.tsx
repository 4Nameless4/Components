import Graph from ".";
import {
  t_link_base,
  t_link_style,
  t_node_base,
  t_node_positions,
  t_node_style,
} from "./types";

export default function GraphDemo() {
  const nodes: t_node_base[] = [];
  const links: t_link_base[] = [];
  const nodeStyle: t_node_style = {
    r: 30,
  };
  const linkStyle: t_link_style = {
    width: 10,
    color: "blue",
  };
  const positions: t_node_positions = {};

  for (let i = 0; i < 500; i++) {
    nodes.push({ id: `a${i}` });
  }
  for (let i = 0; i < 10; i++) {
    links.push({ source: nodes[i].id, target: nodes[i + 1].id });
    i++;
  }

  return (
    <Graph
      mode="svg"
      nodes={nodes}
      links={links}
      positions={positions}
      nodeStyle={nodeStyle}
      linkStyle={linkStyle}
      zoompan={true}
    ></Graph>
  );
}
