"use client";
import React, { useEffect } from "react";

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  fullWidthResponsive = true,
}) {
  useEffect(() => {
    // This tells Google to fill the ad space when the component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden text-center">
      <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your ID
        data-ad-slot={dataAdSlot} // Passed via props
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}></ins>
    </div>
  );
}
