import { useEffect, useMemo, useState } from "react";
// import type { Force } from "d3";
// import { forceSimulation } from "d3";
import { getID, randomColor } from "nameless4-common";
import {
  t_graph_render_props,
  t_link,
  t_link_base,
  t_node,
  t_node_base,
} from "./types";

// *********************  SVG
function renderNode(node: t_node) {
  Object.assign(node);
  return (
    <g key={node.id}>
      <circle></circle>
    </g>
  );
}
function renderLink(link: t_link) {
  Object.assign(link);
  return <path key={link.id}></path>;
}
// function getStyles<D, P extends Record<string, unknown>>(
//   data: D,
//   styles: P | ((data: D) => P)
// ) {
//   let result: Record<string, unknown> = {};
//   if (typeof styles === "function") {
//     result = styles(data);
//   } else {
//     result = styles;
//   }
//   return result;
// }
function initData<N extends t_node_base, L extends t_link_base>(
  _nodes: N[],
  _links: L[]
) {
  const nodes = new Map<string, t_node<N>>();
  const links = new Map<string, t_link<N, L>>();

  const gID = getID();

  const nodeColor = randomColor();

  _nodes.forEach((node) => {
    const id = gID(node.id, {
      suffix: "node",
      warn: (preid, id) =>
        `node data id duplicate: old[${preid}] --> new[${id}]`,
    });

    const nodeData: t_node<N> = {
      id: id,
      data: node,

      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,

      style: {
        fill: nodeColor(id) || "",
        borderColor: "#000000",
        borderWidth: 0,
        text: "",
        r: 5,
      },
    };
    nodes.set(id, nodeData);
  });

  _links.forEach((link) => {
    const id = gID(link.id || `${link.source}_${link.target}`, {
      suffix: "node",
      warn: (preid, id) =>
        `node data id duplicate: old[${preid}] --> new[${id}]`,
    });

    const src = nodes.get(link.source);
    const tar = nodes.get(link.target);

    if (!src || !tar) return;
    const linkData: t_link<N, L> = {
      id: id,
      data: link,

      source: src,
      target: tar,

      style: { color: "#000", width: 3 },
    };
    links.set(id, linkData);
  });

  return {
    nodes,
    links,
  };
}
export default function GraphSVG<N extends t_node_base, L extends t_link_base>(
  props: Partial<t_graph_render_props<N, L>> = {}
) {
  const {
    nodeStyle = {},
    linkStyle = {},
    positions = {},
    nodes = [],
    links = [],
    zoompan = false,
    // forces = true,
  } = props;
  //   const nodeStyle = useState(props.nodeStyle || {}),
  //     linkStyle = useState({}),
  //     positions = useState({}),
  //     nodes = [],
  //     links = [];

  //   let nodeMap = new Map<string, t_node<N>>();
  //   let linkMap = new Map<string, t_link<N, L>>();

  console.warn("1");
  useMemo(() => {
    console.warn("2");
    return [[], []];
    // const data = initData(nodes, links);
    // nodeMap = data.nodes;
    // linkMap = data.links;
    // return [Array.from(data.nodes.values()), Array.from(data.links.values())];
    // setNodes(Array.from(data.nodes.values()));
    // setLinks(Array.from(data.links.values()));
  }, [links, nodes]);

  useMemo(() => {
    console.warn("3");
  }, [nodeStyle, linkStyle]);
  useMemo(() => {
    console.warn("4");
  }, [positions]);
  useMemo(() => {
    console.warn("5");
  }, [zoompan]);

  //   console.warn(nodeMap);
  //   console.warn(linkMap);
  // forceSimulation(_nodes)

  return (
    <svg viewBox="0 0 1000 1000">
      <g>
        {/* {_links.map((d) => renderLink(d))}
        {_nodes.map((d) => renderNode(d))} */}
      </g>
    </svg>
  );
}
// *********************  SVG
