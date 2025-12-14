import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    // Local dev server
    server: {
      port: 3000,
      host: "0.0.0.0"
    },

    // Make env variables available in frontend
    define: {
      "process.env": {
        GEMINI_API_KEY: env.GEMINI_API_KEY
      }
    },

    // Path alias
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  };
});
