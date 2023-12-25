import { useEffect, useMemo, useRef } from "react";
import { t_graph_render_props, t_link_base, t_node_base } from "./types";

export default function GraphCanvas<
  N extends t_node_base,
  L extends t_link_base
>(props: Partial<t_graph_render_props<N, L>> = {}) {
  const {
    nodeStyle = {},
    linkStyle = {},
    nodes = [],
    links = [],
    zoompan = false,
    // forces = true,
  } = props;
  console.warn(nodeStyle);
  console.warn(linkStyle);
  console.warn(nodes);
  console.warn(links);
  console.warn(zoompan);
  // console.warn(forces);

  const canvas = useRef<HTMLCanvasElement | null>(null);

  const ctx = useMemo(() => {
    return canvas.current?.getContext("2d");
  }, [() => canvas.current]);

  useEffect(() => {
    if (!ctx) return;
    ctx.fillStyle = "#000";
  }, [ctx]);

  return <canvas ref=""></canvas>;
}
