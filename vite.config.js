import { defineConfig } from "vite";
import { resolve } from "path";
import multer from "multer";
import uploadImage from "./node/uploadImage";
import express from "express";

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
      formats: ["umd"],
    },
    sourcemap: true,
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
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/main.scss";`,
      },
    },
  },
});
