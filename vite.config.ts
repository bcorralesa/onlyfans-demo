// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/idv": {
          target: env.VITE_APIM_BASE, // e.g. "https://tu-endpoint.apim.azure.net"
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/idv/, "/idv"),
        },
      },
    },
  };
});
