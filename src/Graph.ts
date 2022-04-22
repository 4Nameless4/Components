import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  Simulation,
} from "d3";
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
type t_node_default_props = {
  radius: number;
  color?: string;
  opacity?: number;
};

type t_node_props = Partial<t_node_default_props>;

type t_link_default_props = {
  size: number;
  color?: string;
  opacity?: number;
};

type t_link_props = Partial<t_link_default_props>;

type t_other_default_props = {
  forceX: number;
  forceY: number;
  forceManyBody: number;
  nodeParse?: t_node_props_parse;
  linkParse?: t_link_props_parse;
  alpha: number;
  alphaDecay: number;
  alphaMin: number;
  alphaTarget: number;
  velocityDecay: number;
};

type t_other_props = Partial<t_other_default_props>;

type t_node_props_parse = (node: t_node) => t_node_props;

type t_link_props_parse = (link: t_link) => t_link_props;

type t_props = {
  node?: t_node_props;
  link?: t_link_props;
} & t_other_props;

type t_default_props = {
  node: t_node_default_props;
  link: t_link_default_props;
} & t_other_default_props;

/** data **/
type t_node = t_obj_any & {
  key?: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
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
const defaultProps: t_default_props = {
  node: {
    radius: 5,
  },
  link: {
    size: 1,
  },
  forceX: 0.05,
  forceY: 0.05,
  forceManyBody: -500,
  alpha: 1,
  alphaDecay: 0.001,
  alphaMin: 0.001,
  alphaTarget: 0,
  velocityDecay: 0.4,
};

export class Graph extends Component<t_props & t_default_props, t_origin_data> {
  private data: t_parse_data;
  private dataMap: Map<string, t_parse_data>;
  protected props: t_props & t_default_props;
  protected originData: t_origin_data;
  private position: t_position;
  private force?: Simulation<t_parse_node, undefined>;

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

    this.dataMap = new Map();
  }

  updateData(
    key: string,
    data: { props: t_node_props; position: t_position_data },
    type: "link" | "node"
  ) {
    console.log(key);
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
      const key = n.key || `node_${i}_${Date.now()}_mzw_graph`;
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
        x: n.x || 0,
        y: n.y || 0,
        ...p,
      };
      return result;
    });

    const parseLink: t_parse_link[] = this.originData.links.map((l, i) => {
      const key = l.key || `link_${i}_${Date.now()}_mzw_graph`;
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
      .classed("node", true)
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    nodes
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .classed("circle", true)
      .attr("r", (d) => d.props.radius || null);

    const links = root
      .selectAll("g.link")
      .data(this.data.links)
      .join("g")
      .classed("link", true);

    links
      .selectAll("path.line")
      .data(this.data.links)
      .join("path")
      .classed("line", true)
      .attr(
        "d",
        (d) => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
      );

    this.force = forceSimulation<t_parse_node>()
      .nodes(this.data.nodes)
      .force("forceX", forceX(this.viewBox[2] / 2).strength(this.props.forceX))
      .force("forceY", forceY(this.viewBox[3] / 2).strength(this.props.forceY))
      .force(
        "forceManyBody",
        forceManyBody().strength(this.props.forceManyBody)
      )
      .force("forceLink", forceLink(this.data.links).distance(50).strength(0.8))
      .force(
        "forceCollide",
        forceCollide().radius((d: any) => d.props.radius)
      )
      .alpha(this.props.alpha)
      .alphaDecay(this.props.alphaDecay)
      .alphaMin(this.props.alphaMin)
      .alphaTarget(this.props.alphaTarget)
      .velocityDecay(this.props.velocityDecay)
      .on("tick", () => {
        nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });
  }

  protected drawCanvas(): void {
    const context = this.Canvas.getContext("2d");
  }
}

customElements.define("mzw-graph", Graph);
