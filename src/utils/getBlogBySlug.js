export async function getBlogBySlug(slug) {
  try {
    const response = await fetch(
      `https://admin.avgcskills.com/api/content/get?type=story&slug=${slug}`,
      {
        // Revalidates the cache every 3600 seconds (1 hour).
        // Change to { cache: 'no-store' } if you want it to fetch fresh on every single load.
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return []; // Return an empty array so the page doesn't crash on failure
  }
}
