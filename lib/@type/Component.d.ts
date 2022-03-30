declare type t_props = {
    [k: string]: any;
};
export default class Component extends HTMLElement {
    shadowRoot: ShadowRoot;
    props: t_props;
    constructor(props?: t_props);
    set(props: t_props, b: any): any;
    draw(): void;
    destroy(): void;
}
export {};
