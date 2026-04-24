import React from "react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getBlogBySlug } from "@/utils/getBlogBySlug";
import { notFound } from "next/navigation";

// 1. Dynamic Metadata Generation
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
      canonical: `https://avgcframes.com/industries/${slug}`,
    },
    openGraph: {
      title: article.base.title,
      description: article.base.description,
      type: "article",
      publishedTime: article.base.createdAt,
      url: `https://avgcframes.com/industries/${slug}`,
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

  if (!article || article.payload.category.toLowerCase() !== "industries") {
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

            {/* Article Body - Rendered Dynamically */}
            <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed space-y-2">
              {contentBlocks.map((block, index) => renderBlock(block, index))}
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}
