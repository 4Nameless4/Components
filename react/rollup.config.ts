import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const build = {
  input: "./src/index.ts",
};

const development = {
  input: "",
};

// console.log(process.cwd());
// console.log(process.env);
console.log('****');
console.log(import.meta);

const rollup = {
  input: "./src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [nodeResolve(), commonjs(), typescript()],
};

export default rollup;
