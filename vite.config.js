import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "/index.html"),
        cart: path.resolve(__dirname, "src/pages/cart.html"),
        checkout: path.resolve(__dirname, "src/pages/checkout.html"),
        login: path.resolve(__dirname, "src/pages/login.html"),
        products: path.resolve(__dirname, "src/pages/products.html"),
      },
    },
  },
});
