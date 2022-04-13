import { t_text } from "./_Component";
import { select, forceSimulation, SimulationNodeDatum } from "d3";
import {
  t_origin_datas,
  NodeLinkComponent,
  t_props,
  t_parse_datas,
  t_parse_data_node,
} from "./NodeLinkComponent";

// ********* data ***********
type t_graph_node_data = {
  x: number;
  y: number;
  fx?: number;
  fy?: number;
} & t_parse_data_node<t_graph_node_props>;

// ********* props ***********
type t_graph_node_all_props = {
  radius?: number;
  borderColor?: string;
  borderSize?: string;
  borderOpacity?: number;
  text?: t_text;
};
type t_graph_node_default_props = {
  radius: number;
};
type t_graph_node_props = t_graph_node_all_props & t_graph_node_default_props;
type t_graph_link_all_props = {
  size?: number;
  color?: string;
  colorOpacity?: number;
};
type t_graph_link_default_props = {
  size: number;
  color: string;
};
type t_graph_link_props = t_graph_link_all_props & t_graph_link_default_props;
// ********************************

// ********* default ***********
const default_props: t_props<t_graph_node_props, t_graph_link_props> = {
  node: {
    radius: 5,
  },
  link: {
    size: 1,
    color: "rgba(0,0,0,0)",
  },
};

const default_datas: t_origin_datas = {
  nodes: [],
  links: [],
};
// *****************************

export default class Graph extends NodeLinkComponent<
  t_graph_node_props,
  t_graph_link_props,
  t_graph_node_all_props,
  t_graph_link_all_props
> {
  constructor() {
    super(default_props, default_datas);
  }

  draw(): boolean {
    if (!super.draw()) return false;
    if (!this.parse_data) return false;
    if (this.type === "svg") {
      this.drawSVG(this.parse_data);
      this.shadowRoot.appendChild(this.SVG);
    } else {
      this.drawCanvas();
    }
    return true;
  }

  private drawSVG(data: t_parse_datas<t_graph_node_props, t_graph_link_props>) {
    const nodes = select(this.nodes);
    const links = select(this.links);

    const nodeData: t_graph_node_data[] = data.nodes.map((n) => {
      return Object.assign(n, {
        x: 0,
        y: 0,
        fx: undefined,
        fy: undefined,
      });
    });
    const linkData = Object.assign([], data.links);

    const node = nodes
      .selectAll("g.node")
      .data(nodeData)
      .join("g")
      .classed("node", true);

    // link
    // const link =
    links.selectAll("g.link").data(linkData).join("g").classed("link", true);

    // const circle =
    node
      .selectAll("circle.circle")
      .data((d) => [d])
      .join("circle")
      .classed("circle", true)
      .attr("r", (d) => d.props.radius);

    const text = node
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .classed("text", true);

    // const tspan =
    text
      .selectAll("tspan")
      .data((d) => d.props.text || [])
      .join("tspan")
      .classed("tspan", true)
      .text((d) => {
        let text = null;
        if (typeof d === "string") {
          text = d;
        } else {
          text = d.text;
        }
        return text;
      });

    forceSimulation(nodeData);
  }

  private drawCanvas() {
    const context2d = this.Canvas.getContext("2d");
    console.log(context2d);
  }
}

customElements.define("mzw-graph", Graph);
