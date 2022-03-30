type t_props = { [k: string]: any };

export default class Component extends HTMLElement {
  shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "closed" });
    this.props = {};
  }

  init() {}

  set props(props: t_props) {
    this.props = props;
  }

  get props() {
    return this.props;
  }

  draw() {
    console.log("base draw");
  }

  destroy() {
    console.log("base destroy");
  }
}
