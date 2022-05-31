export type t_obj<T> = {
  [k: string]: T;
};

export type t_props = t_obj<unknown>;

export type t_data<D, Props> = {
  data: D;
  props: Props;
};

export type t_type = "svg" | "canvas";
export type t_viewbox = [number, number, number, number];

export type t_set<Props, Data> = {
  props: Props;
  data: Data;
};

/**
 * Props -> Props
 * OriginDatum -> Input data
 */
export abstract class Component<
  Props extends t_props,
  OriginDatum
> extends HTMLElement {
  readonly shadowRoot: ShadowRoot;
  readonly SVG: SVGElement;
  protected viewBox: t_viewbox;
  readonly Canvas: HTMLCanvasElement;
  protected abstract props: Props;
  protected abstract originData: OriginDatum;
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

  set(parameter: t_set<Partial<Props>, OriginDatum>) {
    this.setProps(
      {
        ...parameter.props,
      },
      false
    );
    this.setData({
      ...parameter.data,
    });
    console.log(this.props);
  }

  setProps(props: Partial<Props>, isParse = true) {
    deepAssign(this.props, props);
    isParse && this.originData && this.setData(this.originData);
  }

  getProps() {
    return deepAssign({}, this.props);
  }

  setData(data: OriginDatum, isParse = true) {
    this.originData = Object.assign({}, data);
    isParse && this.parseData();
  }

  getData() {
    return Object.assign({}, this.originData);
  }

  draw(isParse = false): void {
    isParse && this.parseData();
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
    deepForEach(_obj, (name: string, obj: t_obj<unknown>, path?: string[]) => {
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
  obj: t_obj<any>,
  callback: (name: string, obj: t_obj<unknown>, path?: string[]) => void,
  path?: string[]
) {
  for (const p in obj) {
    const _path = path || [];
    if (obj[p] instanceof Object) {
      _path.push(p);
      deepForEach(obj[p], callback, _path);
    } else {
      callback(p, obj, path);
    }
  }
}

(window as any).mzw = {
  main: deepAssign,
  child: deepForEach,
};
