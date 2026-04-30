import React from "react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getBlogBySlug } from "@/utils/getBlogBySlug";
import { notFound } from "next/navigation";
import TTSPlayer from "@/components/ui/TTSPlayer";
import AdBanner from "@/components/ui/AdBanner"; // <-- Added AdBanner import

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);
  const article = data?.data;

  if (!article) {
    return { title: "Event Not Found" };
  }

  return {
    title: article.base.title,
    description: article.base.description,
    alternates: {
      canonical: `https://avgcframes.com/events/${slug}`,
    },
    openGraph: {
      title: article.base.title,
      description: article.base.description,
      type: "article",
      publishedTime: article.base.createdAt,
      url: `https://avgcframes.com/events/${slug}`,
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

// 2. Add the text extraction helper
const extractPlainText = (blocks) => {
  if (!blocks || blocks.length === 0) return "";
  return blocks
    .map((block) => {
      if (!block.content) return "";
      return block.content.map((inline) => inline.text).join("");
    })
    .join(". "); // Join paragraphs/headings with periods for better audio pacing
};

// --- Main Page Component ---
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);
  const article = data?.data;

  if (!article || article.payload.category.toLowerCase() !== "events") {
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

  // 3. Generate the full text string for the audio player
  const plainTextContent = extractPlainText(contentBlocks);
  const fullAudioText = `${article.base.title}. ${article.base.description}. ${plainTextContent}`;

  // Dynamic Schema (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-gray-900">
        {/* Top Ad Placement - Full Width */}
        <div className="w-full bg-gray-50 flex flex-col items-center justify-center p-4 mb-10 min-h-[100px] md:min-h-[150px]">
          <AdBanner dataAdSlot="5288518138" dataAdFormat="horizontal" />
        </div>

        {/* Added "relative" to the grid container for sticky positioning context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          {/* Main Article Content */}
          <article className="lg:col-span-8 flex flex-col">
            {/* Metadata & Headers */}
            <header className="mb-6">
              <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
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

            {/* 4. Insert the TTS Player here */}
            <TTSPlayer text={fullAudioText} />

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

          {/* Sidebar / Aside (Added h-full for sticky bounds) */}
          <aside className="lg:col-span-4 flex flex-col gap-12 pt-4 h-full">
            {/* Ad Placement 1 - Sticky with z-10 */}
            <div className="sticky top-24 z-10 w-full bg-gray-50 flex flex-col items-center justify-center p-6 min-h-[300px] border border-gray-100 shadow-sm">
              <AdBanner dataAdSlot="5148917338" />
            </div>

            {/* Featured Video - Sticky with z-20 (Added bg-white so it covers the ad seamlessly) */}
            <div className="sticky top-24 z-20 w-full bg-white py-2">
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

            {/* Ad Placement 2 - Sticky with z-30 */}
            <div className="sticky top-24 z-30 w-full bg-gray-50 flex flex-col items-center justify-center p-6 min-h-[300px] border border-gray-100 shadow-sm">
              <AdBanner dataAdSlot="2219590954" />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
