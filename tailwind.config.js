"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            keyframes: {
                blurFadeIn: {
                    '0%': { opacity: '0', filter: 'blur(15px)', transform: 'scale(0.97)' },
                    '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
                }
            },
            animation: {
                blurFadeIn: 'blurFadeIn 0.4s ease-out forwards',
            }
        },
    },
    plugins: [],
};
exports.default = config;
