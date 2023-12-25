import { t_graph_render_props, t_link_base, t_node_base } from "./types";
import GraphSVG from "./svg";
import GraphCanvas from "./canvas";

export interface t_graph_props<
  N extends t_node_base = t_node_base,
  L extends t_link_base = t_link_base
> extends t_graph_render_props<N, L> {
  mode: "svg" | "canvas";
}

export default function Graph<N extends t_node_base, L extends t_link_base>(
  props: Partial<t_graph_props<N, L>> = {}
) {
  const { mode = "svg" } = props;

  return mode === "svg" ? GraphSVG(props) : GraphCanvas(props);
}
