import Link from "next/link";

function LatestTopics({ data }) {
  console.log(data);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-sm">
      <span className="text-orange-500 font-bold">Latest Topics</span>
      {data.map((el, i) => (
        <Link
          href={`/${el.category.toLowerCase()}/${el.slug}`}
          key={i}
          className="px-3 py-1 border rounded-full font-semibold text-black">
          {el.title}
        </Link>
      ))}
    </div>
  );
}

export default LatestTopics;
