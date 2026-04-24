import React from "react";
import Image from "next/image";
import LatestStories from "@/components/sections/home/LatestStories";
import { getLatestCategory } from "@/utils/getLatestCategory";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// 1. Category-Specific Metadata
export const metadata = {
  title: "News",
  description:
    "Read the latest news, updates, and announcements from AVGC FramesShift.",
  // Setting the canonical URL prevents duplicate content issues if parameters are added to the URL later
  alternates: {
    canonical: "https://avgcframes.com/news",
  },
};

export default async function NewsPage() {
  const data = await getLatestCategory("NEWS");
  const news = data?.data || [];

  // 2. Dynamic JSON-LD Schema for the Category Page (ItemList)
  // This tells Google exactly what items belong to this specific category list
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: news.slice(0, 10).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://avgcframes.com/news/${item.slug}`,
      name: item.title,
    })),
  };

  // Handle Empty State
  if (news.length === 0) {
    return (
      <>
        <Header />
        <section className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[50vh] font-sans">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-900 mb-4">
            News
          </h1>
          <p className="text-lg text-gray-600">
            No news articles are currently available. Please check back later!
          </p>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Injecting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 font-sans text-black">
        {/* Header */}
        <header className="mb-12 flex justify-center">
          <h1 className="text-5xl md:text-6xl font-black uppercase text-black">
            News
          </h1>
        </header>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 text-black">
          {/* Left Column - Featured Article */}
          {news.length > 0 && (
            <article className="flex flex-col group">
              {/* FIXED: Added leading slash to href so it resolves from the root domain */}
              <Link href={`/news/${news[0]?.slug}`}>
                <div className="relative w-full aspect-video overflow-hidden rounded-sm">
                  <Image
                    src={news[0]?.image}
                    alt={news[0]?.title || "Featured news article"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mt-5 leading-tight text-gray-900 group-hover:underline decoration-2 underline-offset-4">
                  {news[0]?.title}
                </h2>
                <p className="text-base text-gray-600 mt-3 leading-relaxed line-clamp-3">
                  {news[0]?.description}
                </p>
              </Link>
            </article>
          )}

          {/* Right Column - 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {/* Sub Articles */}
            {news.length > 1 &&
              news.slice(1, 5).map((el, i) => (
                <article className="flex flex-col group" key={i}>
                  {/* FIXED: Added leading slash to href */}
                  <Link href={`/news/${el.slug}`}>
                    <div className="relative w-full aspect-video bg-gray-200 overflow-hidden rounded-sm">
                      <Image
                        src={el.image}
                        alt={el.title || "News article"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="text-lg font-bold mt-4 leading-snug text-gray-900 group-hover:underline decoration-2 underline-offset-4">
                      {el.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                      {el.description}
                    </p>
                  </Link>
                </article>
              ))}
          </div>
        </div>

        {/* Only render LatestStories if there are actually more than 5 items */}
        {news.length > 5 && (
          <LatestStories data={news.slice(5)} text={"Latest News"} />
        )}
      </section>
      <Footer />
    </>
  );
}
