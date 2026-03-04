import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
<<<<<<< HEAD
  base: "/VKM-Panel/",
=======
  base: "./",   // 🔥 shumë e rëndësishme për plugin në çdo path
>>>>>>> 2656b6b (Ndryshon text)
  plugins: [react()],
});