import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "pdfjs-dist/build/pdf.worker.min.js":
        "node_modules/pdfjs-dist/build/pdf.worker.min.js",
    },
  },
});
