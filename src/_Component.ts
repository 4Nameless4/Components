export type t_obj_any = {
  [k: string]: unknown;
};

export type t_text_row = {
  text: string;
  offset?: [number, number];
  color?: string;
  opacity?: number;
};
export type t_text = (string | t_text_row)[];

export type t_svg_view_box = [number, number, number, number];

export type t_type = "svg" | "canvas";

const defaultSVGViewBox: t_svg_view_box = [0, 0, 1920, 1080];

/**
 * T: props
 * K: origin data
 */
export class Component<T, K, I> extends HTMLElement {
  readonly shadowRoot: ShadowRoot;
  readonly SVG: SVGElement;
  readonly Canvas: HTMLCanvasElement;
  protected props: T;
  protected origin_data?: K;
  protected parse_data?: I;
  protected type: t_type;
  private viewBox: [number, number, number, number];

  constructor(props: T, datas?: K) {
    super();
    this.viewBox = defaultSVGViewBox;
    this.shadowRoot = this.attachShadow({ mode: "open" });
    // this.root = document.createElement("div");
    // this.root.id = "root";
    // this.shadowRoot.appendChild(this.root);

    this.SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.SVG.style.width = "100%";
    this.SVG.style.height = "100%";
    this.SVG.setAttributeNS(
      "http://www.w3.org/2000/svg",
      "viewBox",
      this.viewBox.join(" ")
    );

    this.Canvas = document.createElement("canvas");
    this.Canvas.style.width = "100%";
    this.Canvas.style.height = "100%";

    this.props = props;

    if (datas) {
      this.origin_data = datas;
    }

    this.type = "svg";
  }

  protected init() {
    this.viewBox = defaultSVGViewBox;
    this.SVG.remove();
    this.Canvas.remove();
  }

  setProps(props: T) {
    Object.assign(this.props, props);
  }

  getProps() {
    return Object.assign({}, this.props);
  }

  setData(data: K) {
    this.origin_data = Object.assign({}, data);
  }

  getData(): K {
    return Object.assign({}, this.origin_data);
  }

  setViewBox(viewBox: t_svg_view_box) {
    this.viewBox = Object.assign(this.viewBox, viewBox);
    this.SVG.setAttribute("viewBox", `${this.viewBox.join(" ")}`);
  }

  getViewBox() {
    return Object.assign([], this.viewBox);
  }

  draw(): boolean {
    this.init();
    if (!this.origin_data) return false;
    return true;
  }

  setType(type: t_type) {
    this.type = type;
  }
}
