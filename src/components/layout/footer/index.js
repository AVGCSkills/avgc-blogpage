import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-16 text-white overflow-hidden">
      {/* BACKGROUND TILE (ANIMATED) */}
      <div
        className="absolute inset-0 opacity-5 bg-scroll"
        style={{
          backgroundImage: "url('/logo-2.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "120px",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/95"></div>

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* LEFT */}
          <div className="max-w-sm">
            <h2 className="text-2xl font-bold">AVGC FramesShift</h2>
            <p className="text-sm mt-3 font-medium leading-relaxed">
              Insights, stories & ideas for the modern world. Stay informed with
              curated content across technology, industries, and culture.
            </p>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm font-semibold">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              <p className="font-bold mb-2">Explore</p>
              <Link href="#" className="hover:underline">
                News
              </Link>
              <Link href="#" className="hover:underline">
                Industries
              </Link>
              <Link href="#" className="hover:underline">
                Education
              </Link>
              <Link href="#" className="hover:underline">
                Events
              </Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              <p className="font-bold mb-2">Company</p>
              <Link href="#" className="hover:underline">
                About
              </Link>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-2">
              <p className="font-bold mb-2">Social</p>
              <Link href="#" className="hover:underline">
                Instagram
              </Link>
              <Link href="#" className="hover:underline">
                Twitter
              </Link>
              <Link href="#" className="hover:underline">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm font-medium">
          © {new Date().getFullYear()} AVGC FramesShift. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
