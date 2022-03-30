import Component from "./Component";

export default class Graph extends Component {
  constructor() {
    super();
    console.log("Src1 new");
  }
}
customElements.define("mzw-graph", Graph);
