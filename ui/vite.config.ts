import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Static local prototype. UI builds to ../public; no worker, deployment routes, analytics or backend.
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(import.meta.dirname, "./src") } },
  build: { outDir: resolve(import.meta.dirname, "../public"), emptyOutDir: true, chunkSizeWarningLimit: 800 },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1" },
})
