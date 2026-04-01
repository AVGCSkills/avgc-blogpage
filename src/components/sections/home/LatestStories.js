import Image from "next/image";

export default function LatestStories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-9">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 border rounded-full flex items-center justify-center text-xs">
              ◎
            </div>
            <h2 className="text-xl font-extrabold">Latest Stories</h2>
          </div>

          {/* ARTICLES GRID */}
          <div className="flex flex-col ">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border-t  border-gray-600">
                <p className="text-md font-bold mb-1 text-gray-500 mt-4">
                  MOST INNOVATIVE COMPANIES
                </p>
                <div className="h-56 w-full  flex justify-between py-3">
                  <div className="h-full w-[62%] ">
                    <h3 className="text-2xl font-bold">
                      How Reddit CEO Steve Huffman got the upper hand with AI
                    </h3>
                    <p className="text-sm text-gray-400">
                      Reddit isn't just striking deals with AI behemoths like
                      OpenAI and Google. It's smartly using AI itself to serve
                      users and marketers.
                    </p>
                  </div>
                  <div className="h-full w-[35%] relative ">
                    <Image alt="random" fill src="/card.jpg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="lg:col-span-3 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span>🎙️</span>
              <h3 className="font-extrabold">Latest Podcast</h3>
            </div>

            <div className="flex gap-3">
              <Image
                src="/podcast.jpg"
                width={80}
                height={80}
                alt="podcast"
                className="object-cover"
              />

              <div>
                <h4 className="font-bold text-sm">Brand New World</h4>
                <p className="text-xs font-medium mt-1">
                  A podcast about this moment in marketing and advertising.
                </p>
              </div>
            </div>

            <div className="mt-4 bg-gray-200 h-8 flex items-center px-3 text-xs">
              ▶ 0:00 / 2:01
            </div>

            <button className="mt-4 w-full bg-black text-white text-sm font-bold py-2">
              SEE ALL PODCASTS
            </button>
          </div>

          <div>
            <p className="text-xs text-center font-bold mb-2">ADVERTISEMENT</p>

            <div className="bg-red-500 text-white p-4 rounded">
              <p className="font-bold text-sm">
                800K+ recruiters worldwide use Zoho Recruit
              </p>
              <button className="mt-3 bg-white text-black text-xs px-3 py-1 font-bold">
                Try it for free
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
