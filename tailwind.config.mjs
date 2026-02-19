/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#202833',
          accent: '#24e4a7',
          surface: '#2a3442',
          border: '#344154',
          muted: '#9fb0c2',
          sidebar: '#1b222c',
        },
        light: {
          background: '#f8fcff',
          accent: '#163d50',
          surface: '#ffffff',
          border: '#d8e4ec',
          muted: '#6d8593',
        },
      },
      boxShadow: {
        glow: '0 0 10px 0px rgba(36, 228, 167, 0.5)',
      },
    },
  },
  plugins: [],
}
