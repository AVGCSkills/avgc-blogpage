import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white text-black">
      {/* TOP */}
      <div className="w-full px-6 py-2 flex justify-between items-start">
        {/* LOGO IMAGE */}
        <Link href="/">
          <Image
            src="/logo-2.png"
            alt="Logo"
            width={1080}
            height={1350}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* RIGHT */}
        <div className="flex flex-col items-end h-20 justify-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <Menu className="w-6 h-6" />
            <span className="text-sm font-medium">Login</span>
          </div>
          <span className="text-sm text-gray-600 mt-1">Notifications</span>
        </div>
      </div>

      {/* NAV */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2 z-0"></div>

        <div className="relative z-10 flex justify-end px-6">
          <div className="flex bg-white">
            {["News", "Industries", "Education", "Events"].map(
              (item, index) => (
                <Link
                  key={index}
                  href={`/${item.toLowerCase()}`}
                  className="px-6 py-2 border border-black text-sm font-medium bg-white hover:bg-black hover:text-white transition">
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
