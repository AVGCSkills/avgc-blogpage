import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";

// Static Metadata for SEO
export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how AVGC FramesShift collects, uses, and protects your data and personal information.",
  alternates: {
    canonical: "https://avgcframes.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const effectiveDate = "April 22, 2026"; // Update this when you publish

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 font-sans text-black">
        <article>
          {/* Header */}
          <header className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-900 mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Effective Date: {effectiveDate}
            </p>
          </header>

          {/* Policy Content */}
          <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed space-y-8">
            <section>
              <p>
                At <strong>AVGC FramesShift</strong> ("we," "us," or "our"),
                accessible from https://avgcframes.com, the privacy of our
                visitors is of extreme importance to us. This Privacy Policy
                document outlines the types of personal information that is
                received and collected by AVGC FramesShift and how it is used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                1. Information We Collect
              </h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our service to you.
              </p>

              <h3 className="text-xl font-bold font-sans mt-6 mb-2">
                Personal Data
              </h3>
              <p>
                While using our site, we may ask you to provide us with certain
                personally identifiable information that can be used to contact
                or identify you. Personally identifiable information may
                include, but is not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Email address (e.g., if you subscribe to a newsletter or
                  contact us)
                </li>
                <li>First name and last name</li>
                <li>Cookies and Usage Data</li>
              </ul>

              <h3 className="text-xl font-bold font-sans mt-6 mb-2">
                Usage Data
              </h3>
              <p>
                We may also collect information on how the website is accessed
                and used. This Usage Data may include information such as your
                computer's Internet Protocol address (e.g., IP address), browser
                type, browser version, the pages of our site that you visit, the
                time and date of your visit, the time spent on those pages,
                unique device identifiers, and other diagnostic data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                2. Tracking & Cookies Data
              </h2>
              <p>
                We use cookies and similar tracking technologies to track the
                activity on our site and hold certain information. Cookies are
                files with a small amount of data which may include an anonymous
                unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                3. How We Use Your Information
              </h2>
              <p>
                AVGC FramesShift uses the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>To provide and maintain our website</li>
                <li>To notify you about changes to our platform</li>
                <li>
                  To allow you to participate in interactive features when you
                  choose to do so
                </li>
                <li>To provide customer support</li>
                <li>
                  To gather analysis or valuable information so that we can
                  improve our content
                </li>
                <li>To monitor the usage of our website</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                4. Third-Party Services
              </h2>
              <p>
                We may employ third-party companies and individuals to
                facilitate our website ("Service Providers"), to provide the
                service on our behalf, to perform site-related services, or to
                assist us in analyzing how our website is used.
              </p>
              <p>
                These third parties have access to your Personal Data only to
                perform these tasks on our behalf and are obligated not to
                disclose or use it for any other purpose. (e.g., Google
                Analytics).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                5. Security of Data
              </h2>
              <p>
                The security of your data is important to us, but remember that
                no method of transmission over the Internet, or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Data, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                6. Links to Other Sites
              </h2>
              <p>
                Our service may contain links to other sites that are not
                operated by us. If you click on a third-party link, you will be
                directed to that third party's site. We strongly advise you to
                review the Privacy Policy of every site you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mt-8 mb-4 text-gray-900">
                7. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Effective Date" at the top.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </section>

            <section className="bg-gray-50 p-6 sm:p-8 rounded-sm border border-gray-200 mt-12">
              <h2 className="text-2xl font-bold font-sans mt-0 mb-4 text-gray-900">
                8. Contact Us
              </h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-none pl-0 font-sans">
                <li className="mb-2">
                  <strong>By visiting this page on our website:</strong>{" "}
                  <Link
                    href="/contact"
                    className="text-blue-600 hover:underline">
                    https://avgcframes.com/contact
                  </Link>
                </li>
                {/* You can add an email here if you have a public-facing inbox */}
                {/* <li><strong>By email:</strong> privacy@avgcframes.com</li> */}
              </ul>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
