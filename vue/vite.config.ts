import { PluginOption, defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import ElementPlus from "unplugin-element-plus/vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { marked } from "marked";
import fs from "fs";

function vitePluginMd(): PluginOption {
  return {
    name: "my-vite-plugin-md",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // res.writeHead
        const url = req.url;
        if (url.endsWith(".md")) {
          console.log(url);
          res.appendHeader("type", "js");
          const fileStr = fs.readFileSync(url).toString();
          res.write(`export default const md=${JSON.stringify(marked(fileStr))}`);
        }
        // console.log(req.)
        // if (res.path.endsWith(".md")) {
        //   res.type = "js";
        //   const filePath = path.join(process.cwd(), res.path);
        //   res.body = marked(fs.readFileSync(filePath).toString());
        // } else {
        //   await next();
        // }
        next();
      });
    },
    transform(src, path) {
      if (/\.md$/g.test(path)) {
        console.log(path);
        // marked().then((d) => console.log(d));
        // return {
        //   code: "",
        // };
        return `export default ${JSON.stringify(marked(src))}`;
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
