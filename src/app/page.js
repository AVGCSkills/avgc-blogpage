import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import LatestStories from "@/components/sections/home/LatestStories";
import LatestTopics from "@/components/sections/home/LatestTopics";
import StoriesSection from "@/components/sections/home/StoriesSection";
import { getLatestBlogs } from "@/utils/getLatestBlogs";
import Image from "next/image";
import Link from "next/link";

// 1. Updated Metadata for the Homepage
export const metadata = {
  title: {
    // Using 'absolute' prevents the layout.js template from turning this into
    // "AVGC FramesShift | Insights... | AVGC FramesShift"
    absolute: "AVGC FramesShift | Insights, Stories & Ideas",
  },
  description:
    "Explore insightful articles on technology, lifestyle, and modern trends. Stay updated with fresh ideas and expert perspectives.",
};

export default async function Home() {
  const latestBlogs = await getLatestBlogs();

  // Cleaned up iteration: 'forEach' is better than 'map' when not returning a new array
  let news = [];
  let industries = [];
  let education = [];
  let events = [];

  latestBlogs.data.forEach((el) => {
    if (el.category === "NEWS") news.push(el);
    if (el.category === "INDUSTRIES") industries.push(el);
    if (el.category === "EDUCATION") education.push(el);
    if (el.category === "EVENTS") events.push(el);
  });

  // 2. Dynamic JSON-LD Schema for the Homepage (CollectionPage / Blog)
  // This tells search engines exactly what articles are featured on this page right now.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AVGC FramesShift Blog",
    url: "https://avgcframes.com",
    blogPost: latestBlogs.data.slice(0, 5).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://avgcframes.com/${post.category.toLowerCase()}/${post.slug}`,
      image: post.image,
    })),
  };

  return (
    <>
      {/* Injecting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-black">
        <LatestTopics data={latestBlogs.data.slice(1, 4)} />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-8">
            {news.length !== 0 && (
              <ArticleSmall
                category="NEWS"
                title={news[0]?.title}
                desc={news[0]?.description}
                slug={news[0]?.slug}
              />
            )}
            {industries.length !== 0 && (
              <ArticleSmall
                category="INDUSTRIES"
                title={industries[0]?.title}
                desc={industries[0]?.description}
                slug={industries[0]?.slug}
              />
            )}
            {education.length !== 0 && (
              <ArticleSmall
                category="EDUCATION"
                title={education[0]?.title}
                desc={education[0]?.description}
                slug={education[0]?.slug}
              />
            )}
            {events.length !== 0 && (
              <ArticleSmall
                category="EVENTS"
                title={events[0]?.title}
                desc={events[0]?.description}
                slug={events[0]?.slug}
              />
            )}
          </div>

          {/* CENTER COLUMN (Featured Article) */}
          <article className="lg:col-span-6 flex flex-col">
            <Link
              href={`/${latestBlogs.data[0].category.toLowerCase()}/${latestBlogs.data[0].slug}`}
              className="flex flex-col group">
              <span className="text-xs tracking-widest font-bold text-gray-600 group-hover:text-black transition-colors">
                {latestBlogs.data[0].category}
              </span>

              {/* Added 'priority' for LCP optimization and dynamic alt text */}
              <Image
                src={latestBlogs.data[0].image}
                width={800}
                height={400}
                alt={latestBlogs.data[0].title}
                priority
                className="w-full aspect-[16/9] object-cover mt-2 rounded-sm"
              />

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-4 leading-tight group-hover:underline decoration-2 underline-offset-4">
                {latestBlogs.data[0].title}
              </h1>

              <p className="mt-2 text-sm font-medium line-clamp-1 text-gray-700">
                {latestBlogs.data[0].description}
              </p>
            </Link>
          </article>

          {/* RIGHT COLUMN */}
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {latestBlogs.data.slice(4, 7).map((el, i) => (
            <article key={i}>
              <Link
                href={`/${el.category.toLowerCase()}/${el.slug}`}
                className="group block">
                <Image
                  src={el.image}
                  width={400}
                  height={200}
                  alt={el.title}
                  className="w-full aspect-[16/9] object-cover rounded-sm"
                />
                <p className="text-xs font-bold mt-2 text-gray-600 group-hover:text-black">
                  {el.category}
                </p>
                <h2 className="font-bold text-sm mt-1 group-hover:underline">
                  {el.title}
                </h2>
              </Link>
            </article>
          ))}
        </div>

        <StoriesSection
          data={{
            news: news.slice(1, 5),
            industries: industries.slice(1, 5),
            education: education.slice(1, 5),
            events: events.slice(1, 5),
          }}
        />
        <LatestStories
          data={latestBlogs.data.slice(7)}
          text={"Latest Stories"}
        />
      </main>
      <Footer />
    </>
  );
}

// Wrapped in an <article> tag for semantic HTML compliance
function ArticleSmall({ category, title, desc, slug }) {
  return (
    <article>
      <Link href={`/${category.toLowerCase()}/${slug}`} className="group block">
        <p className="text-xs font-bold tracking-widest text-gray-600 group-hover:text-black transition-colors">
          {category}
        </p>
        <h2 className="font-bold text-sm leading-tight mt-1 group-hover:underline">
          {title}
        </h2>
        <p className="text-xs font-medium mt-1 line-clamp-2 text-gray-700">
          {desc}
        </p>
      </Link>
    </article>
  );
}
