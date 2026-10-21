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
    logo: { light: "/spatial-context-icon.svg", dark: "/spatial-context-icon-dark.svg" },
    nav: [
      { text: "Getting Started", link: "/guide/what-is-spatial-context", activeMatch: "/guide/(what-is-spatial-context|install|first-floor-plan)" },
      { text: "Using Spatial Context", link: "/guide/using-the-panel", activeMatch: "/guide/(using-the-panel|placing-devices|wall-materials|connectivity-map|property-tab|settings)" },
      { text: "AI Agents", link: "/ai/using-ai", activeMatch: "/ai/" },
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
      ] },
      { text: "AI Agents", items: [
        { text: "Using the Map with AI", link: "/ai/using-ai" },
        { text: "The Map Data", link: "/ai/map-data" },
      ] },
      { text: "Advanced", items: [
        { text: "Automations and Actions", link: "/advanced/automations" },
        { text: "Stored Data", link: "/advanced/stored-data" },
      ] },
      { text: "Support", items: [
        { text: "Reporting a Problem", link: "/advanced/reporting-a-problem" },
        { text: "Suggesting a Feature", link: "/advanced/suggesting-a-feature" },
        { text: "Buy Me an Espresso", link: "https://buymeacoffee.com/greminn" },
      ] },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/Greminn/ha-spatial-context" }],
    search: { provider: "local" },
    editLink: { pattern: "https://github.com/Greminn/ha-spatial-context/edit/main/site/:path", text: "Edit this page" },
    footer: {
      message: 'Released under the <a href="https://github.com/Greminn/ha-spatial-context/blob/main/LICENSE">MIT License</a>. A personal project, shared as is.',
      copyright: 'Made by <a href="https://github.com/Greminn">Greminn</a> · <a href="https://buymeacoffee.com/greminn">Buy me an espresso</a>',
    },
  },
});
