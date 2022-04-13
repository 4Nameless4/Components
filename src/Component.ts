export type t_obj_any = {
  [k: string]: any;
};

export type t_props = t_obj_any;

export type t_data<D, P> = {
  data: D;
  props: P;
};

export type t_type = "svg" | "canvas";

/**
 * P -> Props
 * OD -> Input data
 */
export abstract class Component<P extends t_props, OD> extends HTMLElement {
  readonly shadowRoot: ShadowRoot | null;
  readonly SVG: SVGElement;
  readonly Canvas: HTMLCanvasElement;
  protected abstract props: P;
  protected abstract originData: OD;
  private type: t_type;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "closed" });

    this.SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.Canvas = document.createElement("canvas");

    this.type = "svg";
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
      this.drawCanvas();
      return;
    }
    if (this.type === "svg") {
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
