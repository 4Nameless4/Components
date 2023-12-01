import { PluginOption, defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import ElementPlus from "unplugin-element-plus/vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import fs from "fs";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code) {
      // const language = hljs.getLanguage(lang) ? lang : "plaintext";
      // console.log(language)
      // return hljs.highlight(code, { language }).value;
      return hljs.highlightAuto(code).value;
    },
  })
);

function formatMD2HTML(src: string) {
  let html = marked.parse(src).toString();
  return `export default ${JSON.stringify(html)}`;
}

function vitePluginMd(): PluginOption {
  return {
    name: "my-vite-plugin-md",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        if (url.endsWith(".md")) {
          res.appendHeader("type", "js");
          const fileStr = fs.readFileSync(url).toString();
          res.write(formatMD2HTML(fileStr));
        }
        next();
      });
    },
    transform(src, path) {
      if (/\.md$/g.test(path)) {
        return formatMD2HTML(src);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, "src/components/index.ts"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "my-lib",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [vue(), ElementPlus({}), vitePluginMd()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
