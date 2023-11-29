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
  create,
} from "d3";
import {
  align2textAnchorMap,
  Component,
  deepAssign,
  t_data,
  vAlign2dominantBaselineMap,
} from "./Component";

export type t_position_data = {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export type t_position = Map<string, t_position_data>;

/** structure **/
export type $t_data_structure<NodeOriginDatum, LinkOriginDatum> = {
  nodes: NodeOriginDatum;
  links: LinkOriginDatum;
};

/** data **/
export type t_origin_node<T> = T & {
  key?: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  text?: string[];
};

export type t_origin_link<T> = T & {
  key?: string;
  source: number;
  target: number;
};

export type t_origin_data<NodeOriginDatum, LinkOriginDatum> = $t_data_structure<
  t_origin_node<NodeOriginDatum>[],
  t_origin_link<LinkOriginDatum>[]
>;

/** props **/
export type t_tspan_style = {
  align?: "left" | "center" | "right";
  vAlign?: "top" | "middle" | "bottom";
  color?: string;
  lengthAdjust?: "spacing" | "spacingAndGlyphs";
  textLength?: number;
  rotate?: number;
  dx?: number | string;
  dy?: number | string;
  x?: number | string;
  y?: number | string;
  size?: number;
};

export type t_text_style = {
  transformBox: "border-box" | "fill-box" | "view-box" | "unset";
  transform: [number | string, number | string];
};

export type t_border_style = {
  color?: string;
  size?: number;
  opacity?: number;
  dashArray?: string;
};

export type t_node_default_props = {
  radius: number;
  color?: string;
  opacity?: number;
  borderStyle?: t_border_style;
  tspanStyle?: t_tspan_style | t_tspan_style[];
  textStyle: t_text_style;
};

export type t_node_partial_props = Partial<t_node_default_props>;

// !!!!!!
export type t_label_text_style = {
  color?: string;
  size?: string;
};

export type t_link_label_default_props<NodeOriginDatum, LinkOriginDatum> = {
  width: number;
  height: number;
  color?: string;
  opacity?: number;
  borderStyle?: t_border_style;
  textStyle?: t_label_text_style;
};

export type t_link_default_props<NodeOriginDatum, LinkOriginDatum> = {
  size: number;
  color: string;
  opacity?: number;
  dashArray?: string;
  marker?: t_marker | t_create_markerF<NodeOriginDatum, LinkOriginDatum>;
  label?: t_link_label_default_props<NodeOriginDatum, LinkOriginDatum>;
  inverse?: Pick<
    t_link_default_props<NodeOriginDatum, LinkOriginDatum>,
    "marker" | "label"
  >;
};

export type t_link_partial_props<NodeOriginDatum, LinkOriginDatum> = Partial<
  t_link_default_props<NodeOriginDatum, LinkOriginDatum>
>;

export type t_force_default_props = {
  /**
   * [0, 1] default: 1
   */
  alpha: number;
  /**
   * [0, 1] default: 0.001
   */
  alphaDecay: number;
  /**
   * [0, 1] default: 0.001
   */
  alphaMin: number;
  /**
   * [0, 1] default: 0
   */
  alphaTarget: number;
  /**
   * [0, 1] default: 0.4
   */
  velocityDecay: number;
};

export type t_force_partial_props = Partial<t_force_default_props>;

export type t_forceF<NodeOriginDatum, LinkOriginDatum> = (
  force: Simulation<t_parse_node<NodeOriginDatum, LinkOriginDatum>, undefined>,
  links: t_parse_link<NodeOriginDatum, LinkOriginDatum>[]
) => void;

export type t_forces = {
  /**
   * [0, 1]
   */
  x: number;
  /**
   * [0, 1]
   */
  y: number;
  /**
   * [-~, ~]
   */
  manyBody: number;
  /**
   * [0, ~]
   */
  linkDistance: number;
  /**
   * [0, 1]
   */
  linkStrength: number;
  /**
   * [0, 1]
   */
  collide: number;
};

export type t_partial_forces = Partial<t_forces>;

export type t_switch_default_props = {
  dragable?: boolean;
  zoomable?: boolean;
  linkPadable?: boolean;
  dragLock?: boolean;
};

export type t_switch_partial_props = Partial<t_switch_default_props>;

export type t_node_props_parseF<NodeOriginDatum> = (
  node: t_origin_node<NodeOriginDatum>
) => t_node_partial_props;

export type t_link_props_parseF<NodeOriginDatum, LinkOriginDatum> = (
  link: t_origin_link<LinkOriginDatum>
) => t_link_partial_props<NodeOriginDatum, LinkOriginDatum>;

export type t_node_custom_callback<NodeOriginDatum, LinkOriginDatum> = (
  data: t_parse_node<NodeOriginDatum, LinkOriginDatum>,
  target: SVGGElement
) => void;

export type t_create_markerF<NodeOriginDatum, LinkOriginDatum> = (
  parseLinkData: t_parse_link<NodeOriginDatum, LinkOriginDatum>,
  isInverse: boolean
) => SVGMarkerElement;

export type t_other_default_props<NodeOriginDatum, LinkOriginDatum> = {
  forceProps: t_force_default_props;
  forces: t_forces | t_forceF<NodeOriginDatum, LinkOriginDatum>;
  nodeParse?: t_node_props_parseF<NodeOriginDatum>;
  linkParse?: t_link_props_parseF<NodeOriginDatum, LinkOriginDatum>;
  nodeCustom?: t_node_custom_callback<NodeOriginDatum, LinkOriginDatum>;
  switch?: t_switch_default_props;
};

export type t_marker = "arrow";
export type t_other_partial_props<NodeOriginDatum, LinkOriginDatum> = {
  forceProps?: t_force_partial_props;
  forces?: t_partial_forces | t_forceF<NodeOriginDatum, LinkOriginDatum>;
  nodeParse?: t_node_props_parseF<NodeOriginDatum>;
  linkParse?: t_link_props_parseF<NodeOriginDatum, LinkOriginDatum>;
  nodeCustom?: t_node_custom_callback<NodeOriginDatum, LinkOriginDatum>;
  switch?: t_switch_partial_props;
};

export type t_default_props<NodeOriginDatum, LinkOriginDatum> = {
  node: t_node_default_props;
  link: t_link_default_props<NodeOriginDatum, LinkOriginDatum>;
} & t_other_default_props<NodeOriginDatum, LinkOriginDatum>;

export type t_partial_props<NodeOriginDatum, LinkOriginDatum> = {
  node?: t_node_partial_props;
  link?: t_link_partial_props<NodeOriginDatum, LinkOriginDatum>;
} & t_other_partial_props<NodeOriginDatum, LinkOriginDatum>;

/** parse Data */
export type t_tspan = {
  content: string;
  style?: t_tspan_style;
};

export type t_parse_node<NodeOriginDatum, LinkOriginDatum> = {
  key: string;
  links: t_parse_link<NodeOriginDatum, LinkOriginDatum>[];
  text?: t_tspan[];
  custom?: t_node_custom_callback<NodeOriginDatum, LinkOriginDatum>;
} & t_data<t_origin_node<NodeOriginDatum>, t_node_default_props> &
  Partial<t_position_data> & {
    x: number;
    y: number;
  };

export type t_parse_link_base<NodeOriginDatum, LinkOriginDatum> = {
  key: string;
  markerKey: string;
  source: t_parse_node<NodeOriginDatum, LinkOriginDatum>;
  target: t_parse_node<NodeOriginDatum, LinkOriginDatum>;
  inverse?: t_parse_link_inverse<NodeOriginDatum, LinkOriginDatum>;
  isInverse?: boolean;
};

export type t_parse_link<NodeOriginDatum, LinkOriginDatum> = t_parse_link_base<
  NodeOriginDatum,
  LinkOriginDatum
> &
  t_data<
    t_origin_link<LinkOriginDatum>,
    t_link_default_props<NodeOriginDatum, LinkOriginDatum>
  > & {
    x: number;
    y: number;
  };

export type t_parse_link_inverse<NodeOriginDatum, LinkOriginDatum> =
  t_parse_link_base<NodeOriginDatum, LinkOriginDatum> &
    t_data<
      t_origin_link<LinkOriginDatum>,
      Pick<t_link_default_props<NodeOriginDatum, LinkOriginDatum>, "marker">
    >;

export type t_parse_data<NodeOriginDatum, LinkOriginDatum> = $t_data_structure<
  t_parse_node<NodeOriginDatum, LinkOriginDatum>[],
  t_parse_link<NodeOriginDatum, LinkOriginDatum>[]
>;
export type t_parse_data_map<NodeOriginDatum, LinkOriginDatum> =
  $t_data_structure<
    Map<string, t_parse_node<NodeOriginDatum, LinkOriginDatum>>,
    Map<string, t_parse_link<NodeOriginDatum, LinkOriginDatum>>
  >;

/** default */
const defaultProps: t_default_props<any, any> = {
  node: {
    radius: 5,
    textStyle: {
      transformBox: "fill-box",
      transform: ["0px", "-50%"],
    },
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
  t_partial_props<NodeOriginDatum, LinkOriginDatum>,
  t_origin_data<NodeOriginDatum, LinkOriginDatum>
> {
  private data: t_parse_data<NodeOriginDatum, LinkOriginDatum>;
  private dataMap: t_parse_data_map<NodeOriginDatum, LinkOriginDatum>;
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
    SVGGElement,
    unknown
  >;
  private links?: Selection<
    SVGPathElement,
    t_parse_link<NodeOriginDatum, LinkOriginDatum>,
    SVGGElement,
    unknown
  >;
  protected drawStateMap: Set<
    keyof t_partial_props<NodeOriginDatum, LinkOriginDatum>
  >;

  constructor() {
    super();

    this.data = {
      nodes: [],
      links: [],
    };

    this.dataMap = {
      nodes: new Map(),
      links: new Map(),
    };

    this.originData = {
      nodes: [],
      links: [],
    };

    this.props = { ...defaultProps };

    this.drawStateMap = new Set();
    this.initDrawStateMap();

    this.position = new Map();
  }

  private initDrawStateMap() {
    const props: {
      [k in keyof Required<
        t_partial_props<NodeOriginDatum, LinkOriginDatum>
      >]: boolean;
    } = {
      node: true,
      link: true,
      forceProps: true,
      forces: true,
      nodeParse: true,
      linkParse: true,
      nodeCustom: true,
      switch: true,
    };
    for (const name in props) {
      this.drawStateMap.add(name as any);
    }
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

  private _parseDataNode() {
    const parseNode: t_parse_node<NodeOriginDatum, LinkOriginDatum>[] =
      this.originData.nodes.map((n, i) => {
        const key = n.key || `node_${i}_${this.hash}`;
        const p = this.position.get(key);
        const props = {
          ...this.props.node,
          ...(this.props.nodeParse && this.props.nodeParse(n)),
        };
        const texts: t_tspan[] = [];

        if (n.text) {
          n.text.forEach((t, i) => {
            const text: t_tspan = {
              content: t,
            };

            if (props.tspanStyle) {
              if (Array.isArray(props.tspanStyle)) {
                props.tspanStyle[i] && (text.style = props.tspanStyle[i]);
              } else {
                text.style = props.tspanStyle;
              }
            }

            texts.push(text);
          });
        }

        const result: t_parse_node<NodeOriginDatum, LinkOriginDatum> = {
          key,
          data: n,
          props,
          links: [],
          x: n.x || 0,
          y: n.y || 0,
          fx: n.fx,
          fy: n.fy,
          text: texts,
          ...p,
        };
        if (this.dataMap.nodes.get(key)) {
          this._dataKeyDuplicateError(result, "node", "nodes");
        }
        this.dataMap.nodes.set(key, result);
        return result;
      });
    return parseNode;
  }

  private _parseDataLink(
    parseNode: t_parse_node<NodeOriginDatum, LinkOriginDatum>[]
  ) {
    const parseLink: t_parse_link<NodeOriginDatum, LinkOriginDatum>[] =
      this.originData.links.map((l, i) => {
        const key = l.key || `link_${i}_${this.hash}`;
        const props = {
          ...this.props.link,
          ...(this.props.linkParse && this.props.linkParse(l)),
        };
        const result: t_parse_link<NodeOriginDatum, LinkOriginDatum> = {
          key,
          markerKey: `marker-end-${key}`,
          data: l,
          props,
          source: parseNode[l.source],
          target: parseNode[l.target],
          x:
            (parseNode[l.source].fx || parseNode[l.source].x) +
            (parseNode[l.target].fx || parseNode[l.target].x),
          y:
            (parseNode[l.source].fy || parseNode[l.source].y) +
            (parseNode[l.target].fy || parseNode[l.target].y),
        };
        if (props.inverse) {
          const inverse: t_parse_link_inverse<
            NodeOriginDatum,
            LinkOriginDatum
          > = {
            key: `${key}_inverse`,
            markerKey: `marker-start-${key}`,
            data: l,
            props: props.inverse,
            source: parseNode[l.target],
            target: parseNode[l.source],
            inverse: result,
            isInverse: true,
          };
          result.inverse = inverse;
        }
        if (this.dataMap.links.get(key)) {
          this._dataKeyDuplicateError(result, "link", "links");
        }
        this.dataMap.links.set(key, result);
        return result;
      });

    return parseLink;
  }

  protected parseData() {
    const parseNode = this._parseDataNode();
    const parseLink = this._parseDataLink(parseNode);
    this.data.nodes.splice(0);
    this.data.links.splice(0);
    Object.assign(this.data.nodes, parseNode);
    Object.assign(this.data.links, parseLink);
  }

  private _dataKeyDuplicateError(
    data:
      | t_parse_node<NodeOriginDatum, LinkOriginDatum>
      | t_parse_link<NodeOriginDatum, LinkOriginDatum>,
    who: string,
    where: string
  ) {
    console.error();
    console.error("**************************");
    console.error(`Duplicate ${who} key: ${data.key} of ${where}`);
    console.error(`Data: `);
    console.error(data);
    console.error("**************************");
    console.error();
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
      this.force.alphaTarget(0.3).restart();
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
      "number" === typeof d.fx && (d.x = d.fx);
      "number" === typeof d.fy && (d.y = d.fy);
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
    const view = select(this.SVGView);
    const zoomF = zoom<SVGElement, unknown>().on("zoom", (e) => {
      view.transition().duration(50).attr("transform", e.transform);
    });

    svg.call(zoomF);
  }

  zoomOff() {
    this.props.switch = {
      ...this.props.switch,
      zoomable: false,
    };
    select(this.SVGView).on(".zoom", null);
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
      >().on("tick", () => {
        this._updatePosition();
      });
    }

    this.force.nodes(this.data.nodes);
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
  private _linkPadding(d: t_parse_link<NodeOriginDatum, LinkOriginDatum>) {
    const sProps = d.source.props;
    const tProps = d.target.props;

    const sx = d.source.x;
    const sy = d.source.y;
    const tx = d.target.x;
    const ty = d.target.y;

    const sDistance =
      sProps.radius +
      (sProps.borderStyle && sProps.borderStyle.size
        ? sProps.borderStyle.size
        : 0);
    const tDistance =
      tProps.radius +
      (tProps.borderStyle && tProps.borderStyle.size
        ? tProps.borderStyle.size
        : 0);

    let resultSourceX = sx;
    let resultSourceY = sy;
    let resultTargetX = tx;
    let resultTargetY = ty;

    const dx = tx - sx;
    const dy = ty - sy;
    const dr = Math.sqrt(dx * dx + dy * dy);
    const sin = dy / dr;
    const cos = dx / dr;

    if (sDistance && sDistance > 0 && !(dx === 0 && dy === 0)) {
      const rdx = sDistance * cos;
      const rdy = sDistance * sin;

      resultSourceX = sx + rdx;
      resultSourceY = sy + rdy;
    }
    if (tDistance && tDistance > 0 && !(dx === 0 && dy === 0)) {
      const rdx = tDistance * cos;
      const rdy = tDistance * sin;

      resultTargetX = tx - rdx;
      resultTargetY = ty - rdy;
    }
    return {
      sx: resultSourceX,
      sy: resultSourceY,
      tx: resultTargetX,
      ty: resultTargetY,
    };
  }

  private _updatePosition() {
    if (!this.nodes || !this.links) return;
    this.nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    this.links.attr("d", (d) => {
      let sx = d.source.x;
      let sy = d.source.y;
      let tx = d.target.x;
      let ty = d.target.y;
      if (this.props.switch && this.props.switch.linkPadable) {
        const position = this._linkPadding(d);
        sx = position.sx;
        sy = position.sy;
        tx = position.tx;
        ty = position.ty;
      }

      return `M${sx},${sy} L${tx},${ty}`;
    });
  }

  private _drawNode() {
    this.nodes = select(this.SVGView)
      .selectAll<SVGGElement, t_parse_node<NodeOriginDatum, LinkOriginDatum>>(
        "g.node"
      )
      .data(this.data.nodes)
      .join("g")
      .classed("node", true);
  }

  private _drawNodeShape() {
    if (!this.nodes) return;

    this.nodes
      .selectAll("circle.node")
      .data((d) => [d])
      .join("circle")
      .classed("node", true)
      .attr("r", (d) => d.props.radius)
      .style("fill", (d) => d.props.color || null)
      .style("opacity", (d) => d.props.opacity || null)
      .style(
        "stroke",
        (d) => (d.props.borderStyle && d.props.borderStyle.color) || null
      )
      .style(
        "stroke-width",
        (d) => (d.props.borderStyle && d.props.borderStyle.size) || null
      )
      .style(
        "stroke-opacity",
        (d) => (d.props.borderStyle && d.props.borderStyle.opacity) || null
      )
      .style(
        "stroke-dasharray",
        (d) => (d.props.borderStyle && d.props.borderStyle.dashArray) || null
      );
  }

  private _drawNodeText() {
    if (!this.nodes) return;

    this.nodes
      .selectAll("text.text")
      .data((d) => (d.text ? [d] : []))
      .join("text")
      .classed("text", true)
      .style("transform-box", (d) => d.props.textStyle.transformBox || null)
      .style("transform", (d) =>
        d.props.textStyle.transform
          ? `translate(${d.props.textStyle.transform[0]}, ${d.props.textStyle.transform[1]})`
          : null
      )
      .selectAll("tspan.textRow")
      .data((d) => d.text || [])
      .join("tspan")
      .classed("textRow", true)
      .text((d) => d.content)
      .style("user-select", "none")
      .style("fill", (d) => (d.style && d.style.color) || null)
      .style("text-anchor", (d) =>
        d.style && d.style.align ? align2textAnchorMap[d.style.align] : null
      )
      .style("dominant-baseline", (d) =>
        d.style && d.style.vAlign
          ? vAlign2dominantBaselineMap[d.style.vAlign]
          : null
      )
      .attr("lengthAdjust", (d) =>
        d.style && d.style.lengthAdjust ? d.style.lengthAdjust : null
      )
      .attr("textLength", (d) =>
        d.style && d.style.textLength ? d.style.textLength : null
      )
      .attr("rotate", (d) =>
        d.style && d.style.rotate ? d.style.rotate : null
      )
      .attr("dx", (d) =>
        d.style &&
        ("number" === typeof d.style.dx || "string" === typeof d.style.dx)
          ? d.style.dx
          : null
      )
      .attr("dy", (d) =>
        d.style &&
        ("number" === typeof d.style.dy || "string" === typeof d.style.dy)
          ? d.style.dy
          : "1em"
      )
      .attr("x", (d) =>
        d.style &&
        ("number" === typeof d.style.x || "string" === typeof d.style.x)
          ? d.style.x
          : 0
      )
      .attr("y", (d) =>
        d.style &&
        ("number" === typeof d.style.y || "string" === typeof d.style.y)
          ? d.style.y
          : null
      )
      .style("font-size", (d) =>
        d.style && "number" === typeof d.style.size ? d.style.size : null
      );
  }

  private _drawNodeCustom() {
    if (!this.nodes || !this.props.nodeCustom) return;
    const custom = this.props.nodeCustom;

    this.nodes
      .selectAll<SVGGElement, t_parse_node<NodeOriginDatum, LinkOriginDatum>>(
        "g.custom"
      )
      .data((d) => [d])
      .join("g")
      .classed("custom", true)
      .each((d, i, a) => {
        custom(d, a[i]);
      });
  }

  private _drawLink() {
    this.links = select(this.SVGView)
      .selectAll<
        SVGPathElement,
        t_parse_link<NodeOriginDatum, LinkOriginDatum>
      >("path.line")
      .data(this.data.links)
      .join("path")
      .classed("line", true)
      .style("opacity", (d) => d.props.opacity || null)
      .style("stroke", (d) => d.props.color || null)
      .style("stroke-width", (d) => d.props.size || null)
      .style("stroke-dasharray", (d) => d.props.dashArray || null)
      .attr("marker-end", (d) => `url(#${d.markerKey})`)
      .attr("marker-start", (d) =>
        d.inverse ? `url(#${d.inverse.markerKey})` : null
      );
  }

  private _createMarker(type: t_marker, isInverse: boolean) {
    const marker = create("svg:marker");
    if (type === "arrow") {
      marker
        .attr("refX", "3")
        .attr("refY", "3")
        .attr("orient", "auto")
        .attr("markerWidth", "6")
        .attr("markerHeight", "6")
        .append("path")
        .attr("d", isInverse ? "M 6 0 L 0 3 L 6 6 z" : "M 0 0 L 6 3 L 0 6 z");
    }
    return marker.node();
  }

  private _drawLinkMarker() {
    select(this.SVGDefs)
      .selectAll("marker.start")
      .data(
        this.data.links.filter((d) => !!(d.inverse && d.inverse.props.marker))
      )
      .join((enter) =>
        enter.append((d) => {
          let element;
          const data = d.inverse;
          if (
            data &&
            data.props.marker &&
            "string" !== typeof data.props.marker
          ) {
            element = data.props.marker(d, true);
          } else {
            element = this._createMarker(
              data && "string" === typeof data.props.marker
                ? data.props.marker
                : "arrow",
              true
            );
          }
          return element;
        })
      )
      .attr("id", (d) => (d.inverse ? d.inverse.markerKey : null))
      .classed("start", true);

    select(this.SVGDefs)
      .selectAll("marker.end")
      .data(this.data.links.filter((d) => !!d.props.marker))
      .join((enter) =>
        enter.append((d) => {
          let element;
          if ("string" !== typeof d.props.marker && d.props.marker) {
            element = d.props.marker(d, false);
          } else {
            element = this._createMarker(d.props.marker || "arrow", false);
          }
          return element;
        })
      )
      .attr("id", (d) => d.markerKey)
      .classed("end", true);
  }

  protected drawSvg(): void {
    if (
      !this.drawState ||
      this.drawState["marker"] ||
      this.drawState["link"] ||
      this.drawState["linkParse"]
    )
      this._drawLinkMarker();

    if (
      !this.drawState ||
      this.drawState["node"] ||
      this.drawState["nodeParse"]
    )
      this._drawNode();

    if (
      !this.drawState ||
      this.drawState["node"] ||
      this.drawState["nodeParse"]
    )
      this._drawNodeShape();

    if (
      !this.drawState ||
      this.drawState["node"] ||
      this.drawState["nodeParse"]
    )
      this._drawNodeText();

    if (
      !this.drawState ||
      this.drawState["node"] ||
      this.drawState["nodeParse"] ||
      this.drawState["nodeCustom"]
    )
      this._drawNodeCustom();

    if (
      !this.drawState ||
      this.drawState["link"] ||
      this.drawState["linkParse"]
    )
      this._drawLink();

    this._updatePosition();

    if (
      !this.drawState ||
      this.drawState["forceProps"] ||
      this.drawState["node"] ||
      this.drawState["nodeParse"]
    )
      this._forceInit();

    if (
      !this.drawState ||
      this.drawState["forces"] ||
      this.drawState["link"] ||
      this.drawState["linkParse"]
    )
      this._forceBind();

    if (this.props.switch && this.props.switch.dragable) {
      this.dragOn();
    } else {
      this.dragOff();
    }

    if (this.props.switch && this.props.switch.zoomable) {
      this.zoomOn();
    } else {
      this.zoomOff();
    }
  }

  //TODO
  protected drawCanvas(): void {
    const context = this.Canvas.getContext("2d");
  }
  // ************* Render *************
}

customElements.define("mzw-graph", Graph);
