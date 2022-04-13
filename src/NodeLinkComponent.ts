import { t_obj_any, Component } from "./_Component";

export type t_props<N, L> = {
  node: N;
  link: L;
};

export type t_node_parse_props<T> = (data: t_data_node) => T;
export type t_link_parse_props<T> = (data: t_data_link) => T;

// ********* origin data ***********
export type t_data_node = t_obj_any;
export type t_data_link = t_obj_any & {
  source: number;
  target: number;
};
export type t_origin_datas = {
  nodes: t_data_node[];
  links: t_data_link[];
};
// ********************************

// ********* parse data ***********
export type t_parse_data_node<T> = {
  key: string;
  data: t_data_node;
  props: T;
};
export type t_parse_data_link<N, L> = {
  key: string;
  data: t_data_link;
  source: t_parse_data_node<N>;
  target: t_parse_data_node<N>;
  props: L;
};
export type t_parse_datas<N, L> = {
  nodes: t_parse_data_node<N>[];
  links: t_parse_data_link<N, L>[];
};
// ********************************

/**
 * T: 必要的样式参数等
 * N: 所有样式参数等
 */
export class NodeLinkComponent<N, L, NA, LA> extends Component<
  t_props<N, L>,
  t_origin_datas,
  t_parse_datas<N, L>
> {
  readonly graph: SVGGElement;
  readonly nodes: SVGGElement;
  readonly links: SVGGElement;
  private nodeProps?: t_node_parse_props<NA>;
  private linkProps?: t_link_parse_props<LA>;

  constructor(props: t_props<N, L>, data: t_origin_datas) {
    super(props, data);
    this.graph = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.graph.classList.add("graph");
    this.nodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.nodes.classList.add("nodes");
    this.links = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.links.classList.add("links");
    this.graph.appendChild(this.nodes);
    this.graph.appendChild(this.links);
    this.SVG.appendChild(this.graph);
  }

  setProps(props: t_props<N, L>) {
    const _props = props;
    super.setProps(_props);
  }

  draw(): boolean {
    if (!super.draw()) return false;
    this.parseData();
    return true;
  }

  private parseData(): t_parse_datas<N, L> {
    const parseNode: t_parse_data_node<N>[] = [];
    const parseLink: t_parse_data_link<N, L>[] = [];
    const data: t_parse_datas<N, L> = {
      nodes: parseNode,
      links: parseLink,
    };

    if (this.origin_data) {
      this.origin_data.nodes.forEach((n, i) => {
        parseNode.push({
          data: n,
          key: `node_${i}`,
          props: {
            ...this.props.node,
            ...(this.nodeProps && this.nodeProps(n)),
          },
        });
      });
      this.origin_data.links.forEach((l, i) => {
        parseLink.push({
          data: l,
          source: parseNode[l.source],
          target: parseNode[l.target],
          key: `link_${i}`,
          props: {
            ...this.props.link,
            ...(this.linkProps && this.linkProps(l)),
          },
        });
      });
    }

    this.parse_data = data;

    return this.parse_data;
  }

  set nodeParse(parse: t_node_parse_props<NA>) {
    this.nodeProps = parse;
  }

  set linkParse(parse: t_link_parse_props<LA>) {
    this.linkParse = parse;
  }
}
