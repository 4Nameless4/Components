import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
// import postcssModules from "postcss-modules";
import autoprefixer from "autoprefixer";
import minimist from "minimist";
import { parse, serialize } from "parse5";
import fs from "fs";
import path from "path";
import { RollupOptions, Plugin } from "rollup";
import { rimrafSync } from "rimraf";

const defaults = {
  rootHTML: "./public/index.html",
  rootJS: "./src/index.ts",
  jsPlace: "%${mainjs}$%",
  public: "./public",
};
const argv = minimist(process.argv.slice(2));

const isProduction = !argv.development;

function walk<T>(
  data: T | T[],
  call: (data: T, deep: number, pre: T | null) => boolean | void | undefined,
  getChildren: (data: T, deep: number, pre: T | null) => T[]
) {
  let deep = 0;
  let pre: T | null = null;
  function _walk(data: T) {
    const result = call(data, deep, pre);
    const children = getChildren(data, deep, pre);
    pre = data;
    deep++;
    if (children && !result) {
      children.forEach((d) => {
        _walk(d);
      });
    }
  }
  if (Array.isArray(data)) {
    data.forEach((d) => {
      _walk(d);
    });
  } else {
    _walk(data);
  }
}

function getHTMLInput(rootHTML: string) {
  let name = path.basename(defaults.rootJS);
  let input = defaults.rootJS;
  let html = fs.readFileSync(rootHTML).toString();
  const fragment = parse(html);
  const nodes = fragment.childNodes;
  walk(
    nodes,
    (node) => {
      const nodeName = node.nodeName;
      if (nodeName === "#text") {
        return;
      }
      if (nodeName === "script") {
        const attrMap = new Map();
        node.attrs.forEach((d: any, i: number) => {
          attrMap.set(d.name, d);
        });
        if (attrMap.get("type").value === "module") {
          const src = attrMap.get("src");
          const originName = src.value;
          input = path.resolve(path.dirname(rootHTML), originName);
          src.value = defaults.jsPlace;
          name = path.basename(originName).replace(/\.[^.]+$/g, "");
          return true;
        }
      }
    },
    (d: any) => d.childNodes
  );

  return { input, html: serialize(fragment), name };
}

function htmlRoot(): Plugin {
  let source = "";
  let inputName = "index";
  return {
    name: "htmlRoot",
    options(options) {
      const { input, html, name } = getHTMLInput(defaults.rootHTML);
      source = html;
      inputName = name;
      return Object.assign(options, { input });
    },
    buildStart() {
      rimrafSync("dist");
      this.addWatchFile(defaults.rootHTML);
    },
    generateBundle(options, bundle) {
      let mainJs = `${inputName}.js`;
      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.name === inputName) {
          mainJs = fileName;
        }
      }

      source = source.replace(defaults.jsPlace, `/${mainJs}`);

      const dir = fs.readdirSync(defaults.public);
      console.log(dir);
      const staticResource = dir.filter(
        (d) => d !== path.basename(defaults.rootHTML)
      );

      const assets: [string, string][] = [];
      staticResource.forEach((d) => {
        const hash = this.emitFile({
          type: "asset",
          fileName: "[name]-[hash].[ext]",
          source: fs.readFileSync(defaults.public + "/" + d).toString(),
        });
        assets.push([d, hash]);
      });
      assets.forEach((d) => {
        source = source.replace(
          d[0],
          `asset/asset-${mainJs}${d[0].replace(
            d[0].replace(/\.[^.]+$/g, ""),
            ""
          )}`
        );
      });
      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source,
      });
    },
  };
}

const rollup: RollupOptions = {
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "[name]-[hash].js",
    assetFileNames: "assets/[name]-[hash].css",
    sourcemap: !isProduction,
  },
  plugins: [
    htmlRoot(),
    nodeResolve(),
    commonjs(),
    typescript({
      sourceMap: !isProduction,
    }),
    postcss({
      plugins: [
        autoprefixer(),
        postcssImport(),
        // postcssModules({})
      ],
    }),
    json(),
    isProduction && terser(),
  ],
};

export default rollup;
