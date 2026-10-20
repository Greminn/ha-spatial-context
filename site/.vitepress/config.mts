import { defineConfig } from "vitepress";

// Published at https://greminn.github.io/ha-spatial-context/ (GitHub Pages), so every address starts with /ha-spatial-context/.
export default defineConfig({
  title: "Spatial Context",
  description: "Give your AI assistant a floor plan of your home, inside Home Assistant.",
  base: "/ha-spatial-context/",
  cleanUrls: true,
  lastUpdated: false,
  head: [["link", { rel: "icon", href: "/ha-spatial-context/favicon.ico" }]],
  themeConfig: {
    logo: { light: "/spatial-context-icon-black-512.png", dark: "/spatial-context-icon-white-512.png" },
    nav: [
      { text: "Install", link: "/guide/install" },
      { text: "Using Spatial Context", link: "/guide/using-the-panel" },
      { text: "AI Agents", link: "/ai/using-ai" },
    ],
    sidebar: [
      { text: "Getting Started", items: [
        { text: "What Is Spatial Context?", link: "/guide/what-is-spatial-context" },
        { text: "Install", link: "/guide/install" },
        { text: "Your First Floor Plan", link: "/guide/first-floor-plan" },
      ] },
      { text: "Using Spatial Context", items: [
        { text: "Using the Panel", link: "/guide/using-the-panel" },
        { text: "Placing Devices", link: "/guide/placing-devices" },
        { text: "Wall Materials", link: "/guide/wall-materials" },
        { text: "Connectivity Map", link: "/guide/connectivity-map" },
        { text: "The Property Tab", link: "/guide/property-tab" },
        { text: "Settings", link: "/guide/settings" },
        { text: "Good to Know", link: "/guide/good-to-know" },
      ] },
      { text: "AI Agents", items: [
        { text: "Using the Map with AI", link: "/ai/using-ai" },
        { text: "The Map Data", link: "/ai/map-data" },
      ] },
      { text: "Advanced (Optional)", items: [
        { text: "Automations and Actions", link: "/advanced/automations" },
        { text: "Reporting a Problem", link: "/advanced/reporting-a-problem" },
      ] },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/Greminn/ha-spatial-context" }],
    search: { provider: "local" },
    editLink: { pattern: "https://github.com/Greminn/ha-spatial-context/edit/main/site/:path", text: "Edit this page" },
    footer: { message: "A personal project, shared as is. No warranty." },
  },
});
