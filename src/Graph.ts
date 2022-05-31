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
  zoom,
} from "d3";
import { Component, deepAssign, t_data } from "./Component";

type t_position_data = {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

type t_position = Map<string, t_position_data>;

/** structure **/
type $t_data_structure<NodeOriginDatum, LinkOriginDatum> = {
  nodes: NodeOriginDatum;
  links: LinkOriginDatum;
};

/** data **/
type t_origin_node<T> = T & {
  key?: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  text?: string[];
};

type t_origin_link<T> = T & {
  key?: string;
  source: number;
  target: number;
};

type t_origin_data<NodeOriginDatum, LinkOriginDatum> = $t_data_structure<
  t_origin_node<NodeOriginDatum>[],
  t_origin_link<LinkOriginDatum>[]
>;

/** props **/
type t_text_style = {
  align: "left" | "center" | "right";
  vAlign: "top" | "middle" | "bottom";
  offset: [number, number];
};

type t_text = {
  content: string;
  style: t_text_style;
};

type t_node_default_props = {
  radius: number;
  color?: string;
  opacity?: number;
  borderColor?: string;
  borderSize?: number;
  borderOpacity?: number;
  borderDash?: string;
  textStyle?: Partial<t_text_style>[];
};

type t_node_partial_props = Partial<t_node_default_props>;

type t_link_default_props = {
  size: number;
  color: string;
  opacity?: number;
  dash?: string;
};

type t_link_partial_props = Partial<t_link_default_props>;

type t_force_default_props = {
  alpha: number;
  alphaDecay: number;
  alphaMin: number;
  alphaTarget: number;
  velocityDecay: number;
};

type t_force_partial_props = Partial<t_force_default_props>;

type t_forceF<NodeOriginDatum, LinkOriginDatum> = (
  force: Simulation<t_parse_node<NodeOriginDatum, LinkOriginDatum>, undefined>,
  links: t_parse_link<NodeOriginDatum, LinkOriginDatum>[]
) => Simulation<
  t_parse_node<NodeOriginDatum, LinkOriginDatum>,
  t_parse_link<NodeOriginDatum, LinkOriginDatum>
>[];

type t_forces = {
  x: number;
  y: number;
  manyBody: number;
  linkDistance: number;
  linkStrength: number;
  collide: number;
};

type t_partial_forces = Partial<t_forces>;

type t_switch_default_props = {
  dragable?: boolean;
  zoomable?: boolean;
  dragLock?: boolean;
};

type t_switch_partial_props = Partial<t_switch_default_props>;

type t_node_props_parseF<NodeOriginDatum> = (
  node: t_origin_node<NodeOriginDatum>
) => t_node_partial_props;

type t_link_props_parseF<LinkOriginDatum> = (
  link: t_origin_link<LinkOriginDatum>
) => t_link_partial_props;

type t_other_default_props<NodeOriginDatum, LinkOriginDatum> = {
  forceProps: t_force_default_props;
  forces: t_forces | t_forceF<NodeOriginDatum, LinkOriginDatum>;
  nodeParse?: t_node_props_parseF<NodeOriginDatum>;
  linkParse?: t_link_props_parseF<LinkOriginDatum>;
  switch?: t_switch_default_props;
};

type t_other_partial_props<NodeOriginDatum, LinkOriginDatum> = {
  forceProps?: t_force_partial_props;
  forces?: t_partial_forces | t_forceF<NodeOriginDatum, LinkOriginDatum>;
  nodeParse?: t_node_props_parseF<NodeOriginDatum>;
  linkParse?: t_link_props_parseF<LinkOriginDatum>;
  switch?: t_switch_partial_props;
};

type t_default_props<NodeOriginDatum, LinkOriginDatum> = {
  node: t_node_default_props;
  link: t_link_default_props;
} & t_other_default_props<NodeOriginDatum, LinkOriginDatum>;

type t_partial_props<NodeOriginDatum, LinkOriginDatum> = {
  node?: t_node_partial_props;
  link?: t_link_partial_props;
} & t_other_partial_props<NodeOriginDatum, LinkOriginDatum>;

/** parse Data */
type t_parse_node<NodeOriginDatum, LinkOriginDatum> = {
  key: string;
  links: t_parse_link<NodeOriginDatum, LinkOriginDatum>[];
  text: Required<t_text>[];
} & t_data<t_origin_node<NodeOriginDatum>, t_node_default_props> &
  Partial<t_position_data>;

type t_parse_link<NodeOriginDatum, LinkOriginDatum> = {
  key: string;
  source: t_parse_node<NodeOriginDatum, LinkOriginDatum>;
  target: t_parse_node<NodeOriginDatum, LinkOriginDatum>;
} & t_data<t_origin_link<LinkOriginDatum>, t_link_default_props>;

type t_parse_data<NodeOriginDatum, LinkOriginDatum> = $t_data_structure<
  t_parse_node<NodeOriginDatum, LinkOriginDatum>[],
  t_parse_link<NodeOriginDatum, LinkOriginDatum>[]
>;

/** default */
const defaultProps: t_default_props<any, any> = {
  node: {
    radius: 5,
  },
  link: {
    size: 1,
    color: "#000",
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

/**
 * NodeOriginDatum: origin node data type
 * LinkOriginDatum: origin link data type
 */
export class Graph<NodeOriginDatum, LinkOriginDatum> extends Component<
  t_default_props<NodeOriginDatum, LinkOriginDatum>,
  t_origin_data<NodeOriginDatum, LinkOriginDatum>
> {
  private data: t_parse_data<NodeOriginDatum, LinkOriginDatum>;
  protected props: t_default_props<NodeOriginDatum, LinkOriginDatum>;
  protected originData: t_origin_data<NodeOriginDatum, LinkOriginDatum>;
  private position: t_position;
  private force?: Simulation<
    t_parse_node<NodeOriginDatum, LinkOriginDatum>,
    undefined
  >;
  private nodes?: Selection<
    SVGGElement,
    t_parse_node<NodeOriginDatum, LinkOriginDatum>,
    SVGElement,
    unknown
  >;
  private links?: Selection<
    SVGPathElement,
    t_parse_link<NodeOriginDatum, LinkOriginDatum>,
    SVGElement,
    unknown
  >;

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

  // ************* props & data *************
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

    const parseNode: t_parse_node<NodeOriginDatum, LinkOriginDatum>[] =
      this.originData.nodes.map((n, i) => {
        const key = n.key || `node_${i}_${Date.now()}_mzw_graph`;
        const p = this.position.get(key);
        const props = {
          ...this.props.node,
          ...(this.props.nodeParse && this.props.nodeParse(n)),
        };
        const texts: Required<t_text>[] = [];

        if (n.text) {
          n.text.forEach((t, i) => {
            const textStyle = props.textStyle ? props.textStyle[i] : {};
            texts.push({
              content: t,
              style: {
                align: "center",
                vAlign: "middle",
                offset: [0, 0],
                ...textStyle,
              },
            });
          });
        }

        const result: t_parse_node<NodeOriginDatum, LinkOriginDatum> = {
          key,
          data: n,
          props,
          links: [],
          x: n.x || 0,
          y: n.y || 0,
          text: texts,
          ...p,
        };
        return result;
      });

    const parseLink: t_parse_link<NodeOriginDatum, LinkOriginDatum>[] =
      this.originData.links.map((l, i) => {
        const key = l.key || `link_${i}_${Date.now()}_mzw_graph`;
        const props = {
          ...this.props.link,
          ...(this.props.linkParse && this.props.linkParse(l)),
        };
        const result: t_parse_link<NodeOriginDatum, LinkOriginDatum> = {
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
  // ************* props & data *************

  // ************* switch *************
  dragOn() {
    if (!this.nodes) return;
    this.props.switch = {
      ...this.props.switch,
      dragable: true,
    };
    const dragsubject = (e: DragEvent) => {
      if (!this.force) return;
      return this.force.find(e.x, e.y);
    };

    const dragStart = (
      e: DragEvent,
      d: t_parse_node<NodeOriginDatum, LinkOriginDatum>
    ) => {
      if (!this.force) return;
      this.force.restart();
    };
    const dragged = (
      e: DragEvent,
      d: t_parse_node<NodeOriginDatum, LinkOriginDatum>
    ) => {
      d.fx = e.x;
      d.fy = e.y;
      d.x = e.x;
      d.y = e.y;
    };
    const dragEnd = (
      e: DragEvent,
      d: t_parse_node<NodeOriginDatum, LinkOriginDatum>
    ) => {
      d.x = d.fx;
      d.y = d.fy;
      if (!this.props.switch || !this.props.switch.dragLock) {
        delete d.fx;
        delete d.fy;
      }
    };

    this.nodes.call(
      drag<
        SVGGElement,
        t_parse_node<NodeOriginDatum, LinkOriginDatum>,
        unknown
      >()
        .subject(dragsubject)
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd)
    );
  }

  dragOff() {
    if (!this.nodes) return;
    this.props.switch = {
      ...this.props.switch,
      dragable: false,
    };
    this.nodes.on(".drag", null);
  }

  zoomOn() {
    this.props.switch = {
      ...this.props.switch,
      zoomable: true,
    };
    const svg = select(this.SVG);
    const zoomF = zoom<SVGElement, unknown>().on("zoom", (e) => {
      svg.style("transform", e.transform);
    });

    svg.call(zoomF);
  }

  zoomOff() {
    this.props.switch = {
      ...this.props.switch,
      zoomable: false,
    };
    select(this.SVG).on(".zoom", null);
  }
  // ************* switch *************

  // ************* force *************
  private _forcePropsUpdate() {
    if (!this.force) return;
    this.force
      .alpha(this.props.forceProps.alpha)
      .alphaDecay(this.props.forceProps.alphaDecay)
      .alphaMin(this.props.forceProps.alphaMin)
      .alphaTarget(this.props.forceProps.alphaTarget)
      .velocityDecay(this.props.forceProps.velocityDecay);
  }

  private _forceInit() {
    if (!this.force) {
      this.force = forceSimulation<
        t_parse_node<NodeOriginDatum, LinkOriginDatum>
      >()
        .nodes(this.data.nodes)
        .on("tick", () => {
          if (!this.nodes || !this.links) return;
          this.nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
          this.links.attr(
            "d",
            (d) =>
              `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
          );
        });
    }

    this._forcePropsUpdate();
  }

  private _forceBind() {
    if (!this.force) return;
    if (typeof this.props.forces === "function") {
      this.props.forces(this.force, this.data.links);
    } else {
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
          forceCollide<t_parse_node<NodeOriginDatum, LinkOriginDatum>>()
            .radius((d) => d.props.radius)
            .strength(this.props.forces.collide)
        );
    }
  }

  private _forceRemove() {
    if (!this.force) return;
    this.force.on("tick", null);
    this.force = undefined;
  }
  // ************* force *************

  // ************* Render *************
  private _drawNode() {
    if (!this.nodes) return;
    this.nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    this.nodes
      .selectAll("circle.node")
      .data((d) => [d])
      .join("circle")
      .classed("node", true)
      .attr("r", (d) => d.props.radius)
      .style("fill", (d) => d.props.color || null)
      .style("opacity", (d) => d.props.opacity || null)
      .style("stroke", (d) => d.props.borderColor || null)
      .style("stroke-width", (d) => d.props.borderSize || null)
      .style("stroke-opacity", (d) => d.props.borderOpacity || null)
      .style("stroke-dasharray", (d) => d.props.borderDash || null);

    this.nodes
      .selectAll("text.text")
      .data((d) => [d])
      .join("text")
      .classed("text", true)
      .selectAll("tspan.textRow")
      .data((d) => d.text)
      .join("tspan")
      .classed("textRow", true)
      .text((d) => d.content)
      .style("text-anchor", (d) => d.style.align)
      // .style("text-anchor", (d) => d.style.vAlign)
      // .style("text-anchor", (d) => d.style.offset);
  }

  private _drawLink() {
    this.links = select(this.SVG)
      .selectAll<
        SVGPathElement,
        t_parse_link<NodeOriginDatum, LinkOriginDatum>
      >("path.line")
      .data(this.data.links)
      .join("path")
      .classed("line", true)
      .attr(
        "d",
        (d) =>
          `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
      )
      .style("opacity", (d) => d.props.opacity || null)
      .style("stroke", (d) => d.props.color || null)
      .style("stroke-width", (d) => d.props.size || null)
      .style("stroke-dasharray", (d) => d.props.dash || null);
  }

  protected drawSvg(): void {
    const root = select(this.SVG);

    this.nodes = root
      .selectAll<SVGGElement, t_parse_node<NodeOriginDatum, LinkOriginDatum>>(
        "g.node"
      )
      .data(this.data.nodes)
      .join("g")
      .classed("node", true);

    this._drawNode();

    this._drawLink();

    this._forceInit();

    this._forceBind();

    if (this.props.switch) {
      if (this.props.switch.dragable) {
        this.dragOn();
      } else {
        this.dragOff();
      }

      if (this.props.switch.zoomable) {
        this.zoomOn();
      } else {
        this.zoomOff();
      }
    }
  }

  //TODO
  protected drawCanvas(): void {
    const context = this.Canvas.getContext("2d");
  }
  // ************* Render *************
}

customElements.define("mzw-graph", Graph);
