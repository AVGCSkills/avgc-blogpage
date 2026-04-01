import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import LatestStories from "@/components/sections/home/LatestStories";
import StoriesSection from "@/components/sections/home/StoriesSection";
import Image from "next/image";

export const metadata = {
  title: "AVGC FramesShift | Insights, Stories & Ideas",
  description:
    "Explore insightful articles on technology, lifestyle, and modern trends. Stay updated with fresh ideas and expert perspectives.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-black">
        {/* TOP TAGS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-sm">
          <span className="text-orange-500 font-bold">Latest Topics</span>
          {[
            "AI AND MIDDLE MANAGEMENT",
            "ALEX COOPER'S UNWELL",
            "POPEYES CLOSURES",
          ].map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 border rounded-full font-semibold text-black">
              {tag}
            </span>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-8">
            <ArticleSmall
              category="PREMIUM"
              title="Quince copied its way to a $10 billion empire..."
              desc="The dupe-culture darling just raised $500 million..."
            />

            <ArticleSmall
              category="TECH"
              title="Deepfakes are warping reality..."
              desc="At SXSW, filmmaker uses generative AI..."
            />

            <ArticleSmall
              category="WORK LIFE"
              title="How much are you worth?"
              desc="Your future income isn't totally predictable..."
            />
          </div>

          {/* CENTER COLUMN */}
          <div className="lg:col-span-6">
            <span className="text-xs tracking-widest font-bold">NEWS</span>

            <Image
              src="/featured.webp"
              width={800}
              height={400}
              alt="featured"
              className="w-full h-[220px] sm:h-[300px] object-cover mt-2"
            />

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-4 leading-tight">
              A record number of Americans want out—and now the government is
              making it easier
            </h1>

            <p className="mt-2 text-sm font-medium">
              Starting in April, the cost to renounce citizenship drops...
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3">
            <div className="border rounded-md">
              <div className="p-3 border-b font-bold text-sm">Most Read ↓</div>

              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="flex gap-3 p-3 border-b last:border-none">
                  <span className="text-lg font-extrabold">{num}</span>
                  <div>
                    <p className="text-xs font-bold">NEWS</p>
                    <p className="text-sm font-semibold leading-tight">
                      Sample headline goes here for trending article
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Image
                src="/card.jpg"
                width={400}
                height={200}
                alt="card"
                className="w-full h-[150px] object-cover"
              />
              <p className="text-xs font-bold mt-2">TECH</p>
              <h3 className="font-bold text-sm">
                Example article card headline goes here
              </h3>
            </div>
          ))}
        </div>
        <StoriesSection />
        <LatestStories />
      </main>

      <Footer />
    </>
  );
}

function ArticleSmall({ category, title, desc }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-widest">{category}</p>
      <h2 className="font-bold text-sm leading-tight mt-1">{title}</h2>
      <p className="text-xs font-medium mt-1">{desc}</p>
    </div>
  );
}
