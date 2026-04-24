import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

// 1. Static Metadata
export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AVGC FramesShift. Send us your inquiries, feedback, or partnership requests.",
  alternates: {
    canonical: "https://avgcframes.com/contact",
  },
};

export default function ContactPage() {
  const contactEmail = "info@avgcskills.com";

  // 2. Specialized ContactPage Schema (JSON-LD)
  // This explicitly tells Google how to display your contact info in rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AVGC FramesShift",
    url: "https://avgcframes.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "AVGC FramesShift",
      email: contactEmail,
      contactPoint: {
        "@type": "ContactPoint",
        email: contactEmail,
        contactType: "customer support",
        availableLanguage: ["English"],
      },
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
        <header className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase text-gray-900 mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Have a question, feedback, or want to collaborate? We'd love to hear
            from you. Fill out the form below or drop us an email.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column - Contact Information */}
          <aside className="lg:col-span-5 flex flex-col space-y-10 bg-gray-50 p-8 md:p-12 rounded-sm border border-gray-100 h-full">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Our team is here to help. Reach out directly via email, and we
                will get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary Email */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-black text-white rounded-full flex-shrink-0">
                  <Mail className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                    Email Us
                  </h3>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                    {contactEmail}
                  </a>
                </div>
              </div>

              {/* Optional: Add Phone/Address here if applicable in the future */}
              {/* <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-200 text-gray-700 rounded-full flex-shrink-0">
                  <MapPin className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Office</h3>
                  <p className="text-base text-gray-600">Mumbai, Maharashtra<br />India</p>
                </div>
              </div> 
              */}
            </div>
          </aside>

          <section className="lg:col-span-7">
            <ContactForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
