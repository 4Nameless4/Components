import { select } from "d3";
import { Component, t_data, t_obj_any } from "./Component";

type t_position_data = {
  x: number;
  y: number;
  fx?: number;
  fy?: number;
};

type t_position = Map<string, t_position_data>;

/** structure **/
type $t_data_structure<N, L> = {
  nodes: N;
  links: L;
};

/** props **/
type t_node_props = {
  radius?: number;
  color?: string;
  opacity?: number;
};

type t_link_props = { size?: number; color?: string; opacity?: number };

type t_node_props_parse = (node: t_node) => t_node_props;

type t_link_props_parse = (link: t_link) => t_link_props;

type t_other_props = {
  nodeParse?: t_node_props_parse;
  linkParse?: t_link_props_parse;
};

type t_props = {
  node?: t_node_props;
  link?: t_link_props;
} & t_other_props;

/** data **/
type t_node = t_obj_any & {
  key?: string;
};

type t_link = t_obj_any & {
  key?: string;
  source: number;
  target: number;
};

type t_origin_data = $t_data_structure<t_node[], t_link[]>;

type t_parse_node = {
  key: string;
  links: t_parse_link[];
} & t_data<t_node, t_node_props> &
  t_position_data;

type t_parse_link = {
  key: string;
  source: t_parse_node;
  target: t_parse_node;
} & t_data<t_link, t_link_props>;

type t_parse_data = $t_data_structure<t_parse_node[], t_parse_link[]>;

/** default */
const defaultProps = {
  node: {
    radius: 5,
    color: "#000",
  },
  link: {
    size: 1,
  },
};

export class Graph extends Component<t_props, t_origin_data> {
  private data: t_parse_data;
  protected props: t_props;
  protected originData: t_origin_data;
  private position: t_position;

  constructor() {
    super();

    this.data = {
      nodes: [],
      links: [],
    };

    this.originData = {
      nodes: [],
      links: [],
    };

    this.props = { ...defaultProps };

    this.position = new Map();
  }

  setPosition(position: t_position) {
    position.forEach((p, k) => {
      this.position.set(k, p);
    });
    this.parseData();
  }

  getPosition() {
    return new Map(this.position.entries());
  }

  protected parseData() {
    if (!this.originData) return;

    const parseNode: t_parse_node[] = this.originData.nodes.map((n, i) => {
      const key = n.key || `node_${i}`;
      const p = this.position.get(key);
      const props = {
        ...this.props.node,
        ...(this.props.nodeParse && this.props.nodeParse(n)),
      };
      const result: t_parse_node = {
        key,
        data: n,
        props,
        links: [],
        x: 0,
        y: 0,
        ...p,
      };
      return result;
    });

    const parseLink: t_parse_link[] = this.originData.links.map((l, i) => {
      const key = l.key || `link_${i}`;
      const props = {
        ...this.props.link,
        ...(this.props.linkParse && this.props.linkParse(l)),
      };
      const result: t_parse_link = {
        key,
        data: l,
        props,
        source: parseNode[l.source],
        target: parseNode[l.target],
      };
      return result;
    });

    this.data.nodes.splice(0);
    this.data.links.splice(0);
    Object.assign(this.data.nodes, parseNode);
    Object.assign(this.data.links, parseLink);
  }

  protected drawSvg(): void {
    const root = select(this.SVG);

    const nodes = root
      .selectAll("g.node")
      .data(this.data.nodes)
      .join("g")
      .classed("node", true);

    nodes
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .classed("circle", true)
      .attr("r", (d) => d.props.radius || null)
      .attr("x", (d) => d.fx || d.x)
      .attr("y", (d) => d.fy || d.y);

    const links = root
      .selectAll("g.link")
      .data(this.data.links)
      .join("g")
      .classed("link", true);

    links
      .selectAll("path.line")
      .data(this.data.links)
      .join("path")
      .classed("line", true);
  }

  protected drawCanvas(): void {
    const context = this.Canvas.getContext("2d");
  }
}

customElements.define("mzw-graph", Graph);
