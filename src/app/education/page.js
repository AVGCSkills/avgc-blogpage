import React from "react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LatestStories from "@/components/sections/home/LatestStories";
import { getLatestCategory } from "@/utils/getLatestCategory";
import Link from "next/link";

// 1. Category-Specific Metadata
export const metadata = {
  title: "Education",
  description:
    "Discover educational resources, tutorials, and expert insights from AVGC FramesShift.",
  alternates: {
    canonical: "https://avgcframes.com/education",
  },
};

export default async function EducationPage() {
  const categoryName = "Education";
  const data = await getLatestCategory("EDUCATION");
  const articles = data?.data || [];

  // 2. Dynamic JSON-LD Schema (ItemList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.slice(0, 10).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://avgcframes.com/education/${item.slug}`,
      name: item.title,
    })),
  };

  // Handle Empty State
  if (articles.length === 0) {
    return (
      <>
        <Header />
        <section className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[50vh] font-sans">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-900 mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600">
            No {categoryName.toLowerCase()} articles are currently available.
            Please check back later!
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
            {categoryName}
          </h1>
        </header>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12 text-black">
          {/* Left Column - Featured Article */}
          {articles.length > 0 && (
            <article className="flex flex-col group">
              <Link href={`/education/${articles[0]?.slug}`}>
                <div className="relative w-full aspect-video overflow-hidden rounded-sm">
                  <Image
                    src={articles[0]?.image}
                    alt={articles[0]?.title || `Featured ${categoryName} image`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mt-5 leading-tight text-gray-900 group-hover:underline decoration-2 underline-offset-4">
                  {articles[0]?.title}
                </h2>
                <p className="text-base text-gray-600 mt-3 leading-relaxed line-clamp-3">
                  {articles[0]?.description}
                </p>
              </Link>
            </article>
          )}

          {/* Right Column - 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {/* Sub Articles */}
            {articles.length > 1 &&
              articles.slice(1, 5).map((el, i) => (
                <article className="flex flex-col group" key={i}>
                  <Link href={`/education/${el.slug}`}>
                    <div className="relative w-full aspect-video bg-gray-200 overflow-hidden rounded-sm">
                      <Image
                        src={el.image}
                        alt={el.title || `${categoryName} article image`}
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
        {articles.length > 5 && (
          <LatestStories
            data={articles.slice(5)}
            text={`Latest in ${categoryName}`}
          />
        )}
      </section>
      <Footer />
    </>
  );
}
