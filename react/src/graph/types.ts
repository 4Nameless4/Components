// import type { Force } from "d3";

import { Force } from "d3-force";

export interface t_node_position {
  id: string;
  x: number;
  y: number;
  fx?: number;
  fy?: number;
}
export type t_node_positions = Record<string, t_node_position>;
export interface t_node_style {
  fill?: string;
  borderColor?: string;
  borderWidth?: number;
  text?: string;
  r?: number;
}
export interface t_link_style {
  color?: string;
  width?: number;
}
export interface t_node_base {
  id: string;
}
export interface t_link_base {
  id?: string;
  source: string;
  target: string;
}
export interface t_node<N extends t_node_base = t_node_base>
  extends t_node_base {
  data: N;
  style: Required<t_node_style>;
}
export interface t_link<L extends t_link_base = t_link_base>
  extends t_link_base {
  id: string;
  data: L;
  style: Required<t_link_style>;
}
export type t_node_map<N extends t_node_base = t_node_base> = Map<
  string,
  t_node<N>
>;
export type t_link_map<L extends t_link_base = t_link_base> = Map<
  string,
  t_link<L>
>;
export type t_force<
  N extends t_node_base = t_node_base,
  L extends t_link_base = t_link_base
> =
  | ((
      nodes: t_node_map<N>,
      links: t_link_map<L>
    ) => Force<t_node_position, t_link<L>>[])
  | boolean;
export interface t_graph_render_props<
  N extends t_node_base = t_node_base,
  L extends t_link_base = t_link_base
> {
  nodeStyle: t_node_style | ((node: N) => t_node_style);
  linkStyle: t_link_style | ((node: L) => t_link_style);
  positions: Record<string, t_node_position>;
  nodes: N[];
  links: L[];
  zoompan: boolean;
  forces: t_force<N, L>;
}

export const GraphDefaultProps = {
  nodeStyle: {},
  linkStyle: {},
  positions: {},
  nodes: [],
  links: [],
};

export function getPos(data?: {
  x: number;
  y: number;
  fx?: number;
  fy?: number;
}) {
  if (!data) {
    return [0, 0];
  }
  return [
    typeof data.fx === "number" ? data.fx : data.x,
    typeof data.fy === "number" ? data.fy : data.y,
  ];
}
