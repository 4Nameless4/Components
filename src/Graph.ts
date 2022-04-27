import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  Simulation,
  Selection,
  drag,
} from "d3";
import { Component, deepAssign, t_data, t_obj_any } from "./Component";

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

type t_force_props = {
  alpha: number;
  alphaDecay: number;
  alphaMin: number;
  alphaTarget: number;
  velocityDecay: number;
};
type t_force = {
  x: number;
  y: number;
  manyBody: number;
  linkDistance: number;
  linkStrength: number;
  collide: number;
};

type t_other_default_props = {
  forceProps: t_force_props;
  forces: t_force;
  nodeParse?: t_node_props_parse;
  linkParse?: t_link_props_parse;
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

type t_data_type = "link" | "node" | "labelnode";

/** default */
const defaultProps: t_default_props = {
  node: {
    radius: 5,
  },
  link: {
    size: 1,
  },
  forceProps: {
    alpha: 1,
    alphaDecay: 0.001,
    alphaMin: 0.001,
    alphaTarget: 0,
    velocityDecay: 0.4,
  },
  forces: {
    x: 0.05,
    y: 0.05,
    manyBody: -500,
    linkDistance: 50,
    linkStrength: 0.8,
    collide: 1,
  },
};

export class Graph extends Component<t_props & t_default_props, t_origin_data> {
  private data: t_parse_data;
  protected props: t_props & t_default_props;
  protected originData: t_origin_data;
  private position: t_position;
  private force?: Simulation<t_parse_node, undefined>;
  private nodes?: Selection<SVGGElement, t_parse_node, SVGElement, any>;
  private links?: Selection<SVGGElement, t_parse_link, SVGElement, any>;

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

  updateProps(options: {
    key: string;
    type: t_data_type;
    props: (t_node_props & Partial<t_position_data>) | t_link_props;
  }) {
    if (options.type === "node") {
      const node = select(this.SVG)
        .selectAll<SVGGElement, t_parse_node>("g.node")
        .filter((d) => d.key === options.key);

      const data = node.data();
      deepAssign(data, {
        ...options.props,
      });

      this.drawNode();
    } else if (options.type === "link") {
      const links = select(this.SVG)
        .selectAll<SVGGElement, t_parse_link>("g.link")
        .filter((d) => d.key === options.key);

      const data = links.data();
      deepAssign(data, {
        ...options.props,
      });

      this.drawLink();
    }
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

  private drawNode() {
    if (!this.nodes) return;
    this.nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    this.nodes
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .classed("circle", true)
      .attr("r", (d) => d.props.radius || null);
  }

  private drawLink() {
    if (!this.links) return;
    this.links
      .selectAll("path.line")
      .data(this.data.links)
      .join("path")
      .classed("line", true)
      .attr(
        "d",
        (d) => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
      );
  }

  dragOn() {
    if (!this.nodes) return;
    const dragsubject = (e: any) => {
      if (!this.force) return;
      return this.force.find(e.x, e.y);
    };

    const dragStart = (e: any, d: t_parse_node) => {
      console.log("dragStart");
    };
    const dragged = (e: any, d: t_parse_node) => {
      d.fx = e.x;
      d.fy = e.y;
    };
    const dragEnd = (e: any, d: t_parse_node) => {
      console.log("dragEnd");
    };

    this.nodes.call(
      drag<any, t_parse_node, unknown>()
        .subject(dragsubject)
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd)
    );
  }

  dragOff() {
    if (!this.nodes) return;
    this.nodes.on(".drag", null);
  }

  private forceInit() {
    this.force = forceSimulation<t_parse_node>()
      .nodes(this.data.nodes)
      .alpha(this.props.forceProps.alpha)
      .alphaDecay(this.props.forceProps.alphaDecay)
      .alphaMin(this.props.forceProps.alphaMin)
      .alphaTarget(this.props.forceProps.alphaTarget)
      .velocityDecay(this.props.forceProps.velocityDecay)
      .on("tick", () => {
        if (!this.nodes) return;
        this.nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });
  }

  private forceBind() {
    if (!this.force) return;
    this.force
      .force(
        "forceX",
        forceX(this.viewBox[2] / 2).strength(this.props.forces.x)
      )
      .force(
        "forceY",
        forceY(this.viewBox[3] / 2).strength(this.props.forces.y)
      )
      .force(
        "forceManyBody",
        forceManyBody().strength(this.props.forces.manyBody)
      )
      .force(
        "forceLink",
        forceLink(this.data.links)
          .distance(this.props.forces.linkDistance)
          .strength(this.props.forces.linkStrength)
      )
      .force(
        "forceCollide",
        forceCollide()
          .radius((d: any) => d.props.radius)
          .strength(this.props.forces.collide)
      );
  }

  protected drawSvg(): void {
    const root = select(this.SVG);

    this.nodes = root
      .selectAll<SVGGElement, t_parse_node>("g.node")
      .data(this.data.nodes)
      .join("g")
      .classed("node", true);

    this.drawNode();

    this.links = root
      .selectAll<SVGGElement, t_parse_link>("g.link")
      .data(this.data.links)
      .join("g")
      .classed("link", true);

    this.drawLink();

    this.forceInit();

    this.forceBind();
  }

  protected drawCanvas(): void {
    const context = this.Canvas.getContext("2d");
  }
}

customElements.define("mzw-graph", Graph);
