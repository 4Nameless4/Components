export type t_obj_any = {
  [k: string]: any;
};

export type t_props = t_obj_any;

export type t_data<D, P> = {
  data: D;
  props: P;
};

export type t_type = "svg" | "canvas";
export type t_viewbox = [number, number, number, number];

/**
 * P -> Props
 * OD -> Input data
 */
export abstract class Component<P extends t_props, OD> extends HTMLElement {
  readonly shadowRoot: ShadowRoot;
  readonly SVG: SVGElement;
  protected viewBox: t_viewbox;
  readonly Canvas: HTMLCanvasElement;
  protected abstract props: P;
  protected abstract originData: OD;
  private type: t_type;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "closed" });

    this.viewBox = [0, 0, 1920, 1080];
    this.SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.setViewBox(this.viewBox);

    this.Canvas = document.createElement("canvas");

    this.SVG.style.width = "100%";
    this.SVG.style.height = "100%";
    this.SVG.style.display = "block";
    this.Canvas.style.width = "100%";
    this.Canvas.style.height = "100%";
    this.Canvas.style.display = "block";

    this.type = "svg";
  }

  setViewBox(viewbox: t_viewbox) {
    Object.assign(this.viewBox, viewbox);
    this.SVG.setAttribute("viewBox", this.viewBox.join(" "));
  }

  getViewBox() {
    return Object.assign([], this.viewBox);
  }

  setType(type: t_type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }

  setProps(props: P) {
    deepAssign(this.props, props);
    this.originData && this.setData(this.originData);
  }

  getProps() {
    return deepAssign({}, this.props);
  }

  setData(data: OD) {
    this.originData = Object.assign({}, data);
    this.parseData();
  }

  getData() {
    return Object.assign({}, this.originData);
  }

  draw(): void {
    if (this.type === "canvas") {
      this.SVG.remove();
      this.shadowRoot.appendChild(this.Canvas);
      this.drawCanvas();
      return;
    }
    if (this.type === "svg") {
      this.Canvas.remove();
      this.shadowRoot.appendChild(this.SVG);
      this.drawSvg();
      return;
    }
  }

  protected abstract drawSvg(): void;

  protected abstract drawCanvas(): void;

  protected abstract parseData(): void;
}

export function deepAssign(originObj: any, ...obj: any[]) {
  obj.forEach((_obj) => {
    deepForEach(_obj, (name: string, obj: t_obj_any, path?: string[]) => {
      if (!path) {
        originObj[name] = obj[name];
      } else {
        let value = originObj || {};
        path.forEach((p, i) => {
          value[p] ??= {};
          value = value[p];
          if (i === path.length - 1) {
            value[name] = obj[name];
          }
        });
      }
    });
  });
  return originObj;
}

export function deepForEach(
  obj: t_obj_any,
  callback: (name: string, obj: t_obj_any, path?: string[]) => void,
  path?: string[]
) {
  const _path = path || [];
  for (const p in obj) {
    if (obj[p] instanceof Object) {
      _path.push(p);
      deepForEach(obj[p], callback, _path);
    } else {
      callback(p, obj, path);
    }
  }
}
