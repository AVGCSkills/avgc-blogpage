// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Block internal/admin routes if you have them (e.g., /api, /admin)
      disallow: ["/api/"],
    },
    sitemap: "https://avgcframes.com/sitemap.xml",
  };
}
