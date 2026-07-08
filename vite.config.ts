import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "none",
            // The deployed realm references the theme as "akzhol"
            // (KC_SPI_THEME_DEFAULT=akzhol). Keep the starter name as a
            // second variant so the shipped JAR matches what production
            // already declares (both names were present in the original JAR).
            themeName: ["akzhol", "keycloakify-starter"]
        })
    ]
});
