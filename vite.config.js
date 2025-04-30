import { defineConfig } from "vite";
import { resolve } from "path";
import multer from "multer";
import uploadImage from "./node/uploadImage";
import express from "express";
import fs from "fs";

const app = express();
const upload = multer({
  dest: __dirname + "/uploads/",
});

// Configure upload handler
app.post("/upload_image", upload.single("upfile"), uploadImage);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/plugin.js"),
      name: "Table",
      fileName: "bundle",
      formats: ["umd", "es"],
    },
    rollupOptions: {
      external: ["@editorjs/editorjs"],
      output: {
        globals: {
          "@editorjs/editorjs": "EditorJS",
        },
      },
    },
    sourcemap: true,
    assetsInlineLimit: 0,
    copyPublicDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 9000,
    proxy: {
      "/upload_image": {
        target: "http://localhost:9000",
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
        },
      },
    },
  },
  plugins: [
    {
      name: "vite-plugin-svg-string",
      enforce: "pre",
      transform(code, id) {
        if (id.endsWith(".svg")) {
          const svgContent = fs.readFileSync(id, "utf-8");
          return {
            code: `export default ${JSON.stringify(svgContent)}`,
            map: null,
          };
        }
      },
    },
    {
      name: "vite-plugin-raw",
      transform(code, id) {
        if (id.endsWith("?raw")) {
          const filePath = id.replace("?raw", "");
          const content = fs.readFileSync(filePath, "utf-8");
          return {
            code: `export default ${JSON.stringify(content)}`,
            map: null,
          };
        }
      },
    },
  ],
});
