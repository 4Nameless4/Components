import typescript from "rollup-plugin-typescript2";
import progress from "rollup-plugin-progress";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import serve from "rollup-plugin-serve";
import os from "os";
import glob from "glob";

const dir = "./dist";

const ip = [];
const port = 8080;
const inf = os.networkInterfaces();

for (let n in inf) {
  for (let i in inf[n]) {
    if (inf[n][i].family === "IPv4") {
      ip.push(inf[n][i].address);
    }
  }
}

const rollup = {
  input: "index.ts",
  output: {
    dir: dir,
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    progress(),
    json(),
    typescript(),
    serve({
      contentBase: "",
      port,
      onListening: (serve) => {
        console.log();
        console.log("***************************************************");
        console.log();
        console.log("        serve start listen on:");
        ip.forEach((_ip) => {
          console.log(`        http://${_ip}:${port}`);
        });
        console.log();
        console.log("***************************************************");
        console.log();
      },
    }),
  ],
  watch: {
    clearScreen: false,
    // buildDelay: 1000,
  },
  // external: ["d3"],
};

export default rollup;
