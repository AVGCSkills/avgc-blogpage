import { getLatestBlogs } from "@/utils/getLatestBlogs";

export default async function sitemap() {
  const baseUrl = "https://avgcframes.com";

  // 1. Define your static routes with specific SEO weights
  const staticPages = [
    { url: "", priority: 1.0, changeFrequency: "daily" },
    { url: "/news", priority: 0.9, changeFrequency: "daily" },
    { url: "/industries", priority: 0.9, changeFrequency: "daily" },
    { url: "/education", priority: 0.9, changeFrequency: "daily" },
    { url: "/events", priority: 0.9, changeFrequency: "daily" },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { url: "/privacy-policy", priority: 0.5, changeFrequency: "yearly" },
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Fetch all dynamic blog posts
  // Note: Depending on your API, you might need to fetch all pages of data here,
  // not just the "latest" to ensure every article gets indexed.
  const response = await getLatestBlogs();
  const articles = response?.data || [];

  // 3. Map the dynamic routes
  const dynamicRoutes = articles.map((article) => ({
    url: `${baseUrl}/${article.category.toLowerCase()}/${article.slug}`,
    // Use the updatedAt date if available, otherwise fallback to createdAt
    lastModified: new Date(
      article.updatedAt || article.createdAt,
    ).toISOString(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
