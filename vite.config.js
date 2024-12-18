import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "کپی شیپور",
        short_name: "کپی شیپور",
        // description: "نیازمندی های خرید ، فروش ، اجاره و خدمات",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/sheypoor-Logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
            form_factor: "wide"
          },
          {
            src: "/sheypoor-Logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
            form_factor: "wide"
          },
        ],
      },
    }),
  ],
});