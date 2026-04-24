import React from "react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";

// 1. Static Metadata
export const metadata = {
  title: "About Us",
  description:
    "Discover the story, mission, and vision behind AVGC FramesShift. Learn how we deliver cutting-edge insights and digital experiences.",
  alternates: {
    canonical: "https://avgcframes.com/about",
  },
};

export default function AboutPage() {
  // 2. Specialized E-E-A-T Schema (JSON-LD)
  // This tells Google exactly who runs the site, establishing authoritativeness.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About AVGC FramesShift",
    url: "https://avgcframes.com/about",
    description: "The story and mission behind AVGC FramesShift.",
    mainEntity: {
      "@type": "Organization",
      name: "AVGC FramesShift",
      url: "https://avgcframes.com",
      // Establishing the founder connects your personal brand's authority to the blog
      founder: {
        "@type": "Person",
        name: "Mithil Nagarcenkar",
        jobTitle: "Founder & Developer",
      },
      // If AVGC FramesShift operates under Vasudhara Group, uncomment this block:
      /*
      "parentOrganization": {
        "@type": "Organization",
        "name": "Vasudhara Group"
      }
      */
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 font-sans text-black">
        <article className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black uppercase text-gray-900 mb-6 tracking-tight">
              About Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              We are a modern digital publishing platform dedicated to bringing
              you the most impactful stories across news, industries, education,
              and events.
            </p>
          </header>

          {/* Featured Hero Image */}
          <figure className="relative w-full aspect-[21/9] bg-gray-100 rounded-sm overflow-hidden mb-16">
            {/* Replace with your geometric, faceless brand imagery */}
            <Image
              src="/images/about-hero.jpg"
              alt="AVGC FramesShift digital platform architecture"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </figure>

          {/* Content Sections (Semantic Structure) */}
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 space-y-12">
            <section>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p>
                At AVGC FramesShift, our goal is to cut through the noise. We
                leverage high-performance web technologies and streamlined
                content management to deliver lightning-fast, highly readable
                insights to our audience.
              </p>
            </section>

            <section className="bg-gray-50 p-8 border-l-4 border-black rounded-r-md my-12">
              <h2 className="text-2xl font-extrabold text-gray-900 mt-0 mb-4">
                The Platform
              </h2>
              <p className="mb-0">
                Built from the ground up by Mithil Nagarcenkar, AVGC FramesShift
                operates on a cutting-edge headless architecture. By blending
                dynamic React interfaces with automated content workflows, we
                ensure that our readers always have access to optimized,
                seamless, and engaging digital experiences.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                What We Cover
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
                <li className="bg-white border border-gray-200 p-4 rounded-sm shadow-sm">
                  <strong>News:</strong> Up-to-the-minute updates and
                  announcements.
                </li>
                <li className="bg-white border border-gray-200 p-4 rounded-sm shadow-sm">
                  <strong>Industries:</strong> Deep dives into market trends and
                  innovations.
                </li>
                <li className="bg-white border border-gray-200 p-4 rounded-sm shadow-sm">
                  <strong>Education:</strong> Resources and insights for
                  continuous learning.
                </li>
                <li className="bg-white border border-gray-200 p-4 rounded-sm shadow-sm">
                  <strong>Events:</strong> Coverage of the gatherings shaping
                  our future.
                </li>
              </ul>
            </section>

            <section className="text-center pt-12 border-t border-gray-200 mt-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Want to get in touch?
              </h2>
              <Link
                href="/contact"
                className="inline-block bg-black text-white font-bold px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors rounded-sm">
                Contact Us
              </Link>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
