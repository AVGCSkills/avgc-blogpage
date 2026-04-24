import React from "react";
import Image from "next/image";
import { getBlogBySlug } from "@/utils/getBlogBySlug";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// 1. Dynamic Metadata Generation
// Next.js will call this function BEFORE rendering the page to inject the correct <head> tags
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);
  const article = data?.data;

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.base.title,
    description: article.base.description,
    alternates: {
      canonical: `https://avgcframes.com/news/${slug}`,
    },
    // Open Graph is strictly generated here so individual articles look great when shared
    openGraph: {
      title: article.base.title,
      description: article.base.description,
      type: "article",
      publishedTime: article.base.createdAt,
      url: `https://avgcframes.com/news/${slug}`,
      images: [
        {
          url: article.payload.image,
          width: 1200,
          height: 630,
          alt: article.base.title,
        },
      ],
    },
  };
}

// --- Rich Text Renderer Helpers ---
const renderTextWithMarks = (text, marks, key) => {
  if (!marks || marks.length === 0) return <span key={key}>{text}</span>;

  let wrappedText = text;
  marks.forEach((mark) => {
    if (mark.type === "bold") {
      wrappedText = <strong key={`bold-${key}`}>{wrappedText}</strong>;
    }
    if (mark.type === "italic") {
      wrappedText = <em key={`italic-${key}`}>{wrappedText}</em>;
    }
  });

  return <span key={key}>{wrappedText}</span>;
};

const renderBlock = (block, index) => {
  if (!block.content) return <br key={index} />;

  switch (block.type) {
    case "heading":
      const Tag = `h${block.attrs?.level || 2}`;
      return (
        <Tag
          key={index}
          className="font-sans font-bold text-gray-900 mt-8 mb-4">
          {block.content.map((inline, i) =>
            renderTextWithMarks(inline.text, inline.marks, i),
          )}
        </Tag>
      );
    case "paragraph":
      return (
        <p key={index} className="mb-4">
          {block.content.map((inline, i) =>
            renderTextWithMarks(inline.text, inline.marks, i),
          )}
        </p>
      );
    default:
      console.warn("Unsupported block type:", block.type);
      return null;
  }
};

// --- Main Page Component ---
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);
  const article = data?.data;

  if (!article || article.payload.category.toLowerCase() !== "news") {
    notFound();
  }

  const date = new Date(article.base.createdAt);
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/\//g, "-");

  const contentBlocks = article.payload.mainContent?.content || [];

  // 2. Dynamic Article Schema (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.base.title,
    image: [article.payload.image],
    datePublished: article.base.createdAt,
    // Using createdAt as a fallback if updatedAt doesn't exist
    dateModified: article.base.updatedAt || article.base.createdAt,
    description: article.base.description,
    publisher: {
      "@type": "Organization",
      name: "AVGC FramesShift",
      url: "https://avgcframes.com",
    },
  };

  return (
    <>
      {/* Injecting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 flex flex-col">
            {/* Metadata & Headers */}
            <header className="mb-6">
              <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
                {/* 3. Semantic Time Tag */}
                <time dateTime={article.base.createdAt}>{formatted}</time>
                <span className="mx-2">|</span> {article.payload.category}
              </div>

              {/* This is the single H1 for the page */}
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                {article.base.title}
              </h1>
              <p className="text-xl md:text-2xl font-light text-gray-600 leading-snug mb-6">
                {article.base.description}
              </p>
            </header>

            {/* Hero Image */}
            <figure className="mb-8">
              <div className="relative w-full aspect-video bg-gray-100 rounded-sm overflow-hidden">
                <Image
                  src={article.payload.image}
                  alt={article.base.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            </figure>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed space-y-2">
              {contentBlocks.map((block, index) => renderBlock(block, index))}
            </div>
          </article>
          {/* <aside className="lg:col-span-4 flex flex-col gap-12 pt-4">
            <div className="w-full bg-[#c084fc] flex flex-col items-center justify-center text-center p-6 min-h-[500px]">
              <div className="text-xs mb-4 uppercase tracking-widest text-black/50">
                Advertisement
              </div>
              <h3 className="font-serif text-3xl font-black text-black leading-none mb-2">
                BRANDS
              </h3>
              <h3 className="font-serif text-xl font-bold text-black mb-8">
                THAT MATTER
              </h3>
              <div className="text-xl font-black tracking-widest mb-2">
                CALL FOR ENTRIES
              </div>
              <p className="text-sm tracking-widest mb-8">
                SHOWCASE YOUR IMPACT
              </p>
              <button className="bg-blue-600 text-white font-bold text-xs px-8 py-3 uppercase tracking-wider mb-4">
                Apply Now
              </button>
              <div className="text-[10px] tracking-widest uppercase">
                Final Deadline: May 15
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black tracking-widest uppercase border-b-2 border-black pb-2 mb-4">
                Featured Video
              </h3>
              <div className="relative w-full aspect-video bg-gray-100 mb-3 cursor-pointer group">
                <Image
                  src="/api/placeholder/400/225"
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-black border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-sm leading-tight hover:text-gray-600 cursor-pointer">
                Meet Kyoto: the typeface that bleeds (on purpose)
              </h4>
            </div>

            <div className="w-full bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-6 min-h-[400px]">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                Advertisement
              </div>
              <div className="relative w-full aspect-video mb-6">
                <Image
                  src="/api/placeholder/400/225"
                  alt="Innovation Festival Graphic"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="font-black text-xl tracking-widest uppercase text-center leading-none mb-4">
                Innovation
                <br />
                Festival
              </div>
              <div className="text-xs font-bold tracking-widest">
                SEPT 14-17 NYC
              </div>
            </div>
          </aside> */}
        </div>
      </div>
      <Footer />
    </>
  );
}
