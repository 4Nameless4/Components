import { Component } from "../src/Component";

export default class Demo {
  root: HTMLElement;
  private _component?: Component<any, any>;

  constructor(component?: Component<any, any>) {
    this.root =
      document.querySelector("#root") || document.createElement("div");

    if (component) {
      this._component = component;
    }
  }

  setComponent(component: Component<any, any>) {
    this._component = component;
  }

  getComponent() {
    return this._component;
  }

  draw() {
    if (!this._component) {
      return;
    }
    this.root.append(this._component);
    this._component.draw();
  }

  destroy() {
    this._component = undefined;
  }
}
