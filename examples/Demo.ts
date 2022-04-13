import { Component } from "../src/_Component";

export default class Demo<T extends { [k: string]: unknown }, K> {
  root: HTMLElement;
  private _component?: Component<unknown, unknown, unknown>;

  constructor(component?: Component<unknown, unknown, unknown>) {
    this.root =
      document.querySelector("#root") || document.createElement("div");
    if (component) {
      this._component = component;
    }
  }

  set(component?: Component<unknown, unknown, unknown>) {
    this._component = component;
  }

  get() {
    return this._component;
  }

  draw() {
    if (!this._component) {
      return;
    }
    this.root.append(this._component);
    this._component.draw();
  }

  destroy() {}
}
