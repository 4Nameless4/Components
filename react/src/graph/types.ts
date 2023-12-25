export interface t_node_position {
  x: number;
  y: number;
  fx?: number;
  fy?: number;
}
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
  extends t_node_base,
    t_node_position {
  data: N;
  style: t_node_style;
}
export interface t_link<
  N extends t_node_base = t_node_base,
  L extends t_link_base = t_link_base
> {
  id: string;
  source: t_node<N>;
  target: t_node<N>;
  data: L;
  style: t_link_style;
}

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
  // forces: Force<t_node<N>, t_link<N, L>>[] | boolean;
}

