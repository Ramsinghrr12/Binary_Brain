// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5002, // Set the port to 5000
//     host: true, // Allow access from the network
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000", // Proxy API requests to your backend
//         changeOrigin: true,
//       },
//     },
//   },
// });

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});