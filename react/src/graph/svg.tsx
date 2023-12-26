import { useEffect, useMemo, useRef, useState } from "react";
import {
  Force,
  Simulation,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { getID, pan, randomColor, zoom } from "nameless4-common";
import {
  GraphDefaultProps,
  getPos,
  t_force,
  t_graph_render_props,
  t_link,
  t_link_base,
  t_link_map,
  t_link_style,
  t_node,
  t_node_base,
  t_node_map,
  t_node_position,
  t_node_positions,
  t_node_style,
} from "./types";

function renderNode(node: t_node, positions: t_node_positions) {
  const pos = getPos(positions[node.id]);
  return (
    <g key={node.id} transform={`translate(${pos[0]} ${pos[1]})`}>
      <circle
        r={node.style.r}
        fill={node.style.fill}
        stroke={node.style.borderColor}
        strokeWidth={node.style.borderWidth}
      ></circle>
      <text>{node.style.text}</text>
    </g>
  );
}
function renderNodes(nodes: t_node_map, positions: t_node_positions) {
  const nodesEl: JSX.Element[] = [];
  nodes.forEach((d) => {
    nodesEl.push(renderNode(d, positions));
  });
  return nodesEl;
}
function renderLink(link: t_link, positions: t_node_positions) {
  const sPos = getPos(positions[link.source]);
  const tPos = getPos(positions[link.target]);
  return (
    <path
      key={link.id}
      stroke={link.style.color}
      strokeWidth={link.style.width}
      d={`M${sPos[0]} ${sPos[1]}L${tPos[0]} ${tPos[1]}`}
    ></path>
  );
}
function renderLinks(
  links: t_link_map,
  positions: t_node_positions,
  nodes: t_node_map
) {
  const linksEl: JSX.Element[] = [];
  links.forEach((d) => {
    if (!nodes.has(d.source) || !nodes.has(d.target)) return;
    linksEl.push(renderLink(d, positions));
  });
  return linksEl;
}
function getStyles<D, P extends t_link_style | t_node_style>(
  data: D,
  styles: P | ((data: D) => P)
) {
  let result: unknown = {};
  if (typeof styles === "function") {
    result = styles(data);
  } else {
    result = styles;
  }
  return result;
}
function initNodeData<N extends t_node_base>(_nodes: N[]) {
  const nodes: t_node_map<N> = new Map();
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
  return nodes;
}
function initLinkData<L extends t_link_base>(_links: L[]) {
  const links: t_link_map<L> = new Map();
  const gID = getID();

  _links.forEach((link) => {
    const id = gID(link.id || `${link.source}_${link.target}`, {
      suffix: "link",
      warn: (preid, id) =>
        `link data id duplicate: old[${preid}] --> new[${id}]`,
    });

    const linkData: t_link<L> = {
      id: id,
      data: link,

      source: link.source,
      target: link.target,

      style: { color: "#000", width: 3 },
    };
    links.set(id, linkData);
  });
  return links;
}
function forceBind<
  N extends t_node_base = t_node_base,
  L extends t_link_base = t_link_base
>(
  simulation: Simulation<t_node_position, t_link_base>,
  forces: t_force<N, L>,
  forceCount: number,
  nodes: t_node_map<N>,
  links: t_link_map<L>
) {
  let cnt = 0;
  let _forces: Force<t_node_position, t_link<L>>[] = [];
  const _links: t_link_map<L> = new Map();
  const _linksArr: t_link<L>[] = [];
  links.forEach((d, k) => {
    const l = { ...d };
    _links.set(k, l);
    _linksArr.push(l);
  });
  if (typeof forces !== "function" && forces) {
    _forces = [
      forceCollide<t_node_position>().radius(
        (d) => nodes.get(d.id)!.style.r + 5
      ),
      forceManyBody<t_node_position>().strength(
        (d) => nodes.get(d.id)!.style.r * -6
      ),
      forceX(),
      forceY(),
      forceLink<t_node_position, t_link<L>>(_linksArr).id((d) => d.id),
    ];
  } else if (forces) {
    _forces = forces(nodes, _links);
  }

  // unmount old force
  for (let i = 0; i < forceCount; i++) {
    simulation.force(String(i), null);
  }

  // mount new force
  _forces.forEach((f, index) => {
    simulation!.force(String(index), f);
    cnt++;
  });
  return cnt;
}
export default function GraphSVG<N extends t_node_base, L extends t_link_base>(
  props: Partial<t_graph_render_props<N, L>> = {}
) {
  const {
    nodeStyle = GraphDefaultProps.nodeStyle as t_graph_render_props<
      N,
      L
    >["nodeStyle"],
    linkStyle = GraphDefaultProps.linkStyle as t_graph_render_props<
      N,
      L
    >["linkStyle"],
    positions = GraphDefaultProps.positions as t_graph_render_props<
      N,
      L
    >["positions"],
    nodes = GraphDefaultProps.nodes,
    links = GraphDefaultProps.links,
    zoompan = false,
    forces = true,
  } = props;

  const nodeMap = useMemo(() => initNodeData(nodes), [nodes]);
  const linkMap = useMemo(() => initLinkData(links), [links]);
  const [_positions, setPos] = useState<t_node_positions>({});
  const [simulation] = useState(forceSimulation<t_node_position, t_link_base>);
  const [forceCount, setCount] = useState(0);
  const svgRef = useRef<null | SVGSVGElement>(null);
  const zoomRef = useRef<null | SVGGElement>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const transformStr = useMemo(() => {
    return `translate(${transform.x} ${transform.y}) scale(${transform.scale})`;
  }, [transform]);

  simulation.on("tick", () => {
    if (!nodes.length) return;
    setPos({ ..._positions });
  });

  // positions
  useEffect(() => {
    const forcePos: t_node_position[] = [];
    const pos: t_node_positions = {};
    nodeMap.forEach((d) => {
      const id = d.id;
      const p = positions[id] || {
        id,
        x: Math.random() * 1000 - 500,
        y: Math.random() * 1000 - 500,
      };
      pos[id] = p;
      forcePos.push(p);
    });
    simulation.nodes(forcePos);
    setPos({ ...pos });
  }, [nodeMap, positions]);
  // nodeStyle
  useEffect(() => {
    nodeMap.forEach((d) => {
      const s = getStyles(d.data, nodeStyle);
      Object.assign(d.style, s);
    });
  }, [nodeMap, nodeStyle]);
  // linkStyle
  useEffect(() => {
    linkMap.forEach((d) => {
      const s = getStyles(d.data, linkStyle);
      Object.assign(d.style, s);
    });
  }, [linkMap, linkStyle]);
  // forces
  useEffect(() => {
    if (forces) {
      const cnt = forceBind(simulation, forces, forceCount, nodeMap, linkMap);
      setCount(cnt);
    } else {
      simulation.stop();
    }
  }, [forces, nodeMap, linkMap]);

  // view box
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ob = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.setAttribute("viewBox", `-${w / 2} -${h / 2} ${w} ${h}`);
    });
    ob.observe(el);
    return () => {
      ob.disconnect();
    };
  }, []);

  function wheel(event: React.WheelEvent<SVGSVGElement>) {
    event.preventDefault();
    const svg = svgRef.current;
    const zoomEl = zoomRef.current;
    if (!svg || !zoomEl) return;

    const scaleOffset =
      -event.deltaY *
      (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
      (event.ctrlKey ? 10 : 1);

    const { scale, translate } = zoom({
      transformEL: zoomEl,
      scaleOffset,
      clientPos: [event.clientX, event.clientY],
      svg,
    });

    setTransform({
      scale,
      x: translate[0],
      y: translate[1],
    });
  }

  function pointerdown(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    const zoomEl = zoomRef.current;
    if (!svg || !zoomEl) return;

    pan([event.clientX, event.clientY], svg, zoomEl, (translate) => {
      setTransform((d) => {
        return {
          ...d,
          x: translate[0],
          y: translate[1],
        };
      });
    });
  }

  return (
    <svg
      viewBox="-500 -500 1000 1000"
      ref={svgRef}
      onWheel={zoompan ? wheel : undefined}
      onPointerDown={zoompan ? pointerdown : undefined}
    >
      <g transform={transformStr} ref={zoomRef}>
        {renderLinks(linkMap, _positions, nodeMap)}
        {renderNodes(nodeMap, _positions)}
      </g>
    </svg>
  );
}
