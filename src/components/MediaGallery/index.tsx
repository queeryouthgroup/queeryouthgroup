// MediaGallery component - for gallery 
// components/PrideMediaGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { urlFor } from "@/sanity/lib/imageUrl"; // adjust to your image builder
import type { GalleryImage } from "@/sanity/schemaTypes/galleryImageType";

interface Props {
  images: GalleryImage[];
}

export function PrideMediaGallery({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (!images.length) {
    return <p className="text-gray-500 mt-8">No images found.</p>;
  }

  const slides = images.map((item) => ({
    src: urlFor(item.image).width(1600).quality(90).url(),
    alt: item.image.alt ?? item.title,
    title: item.title,
  }));

  return (
    <>
      <div
        className="w-full"
        style={{ columns: "3 280px", columnGap: "12px" }}
      >
        {images.map((item, index) => (
          <div
            key={item._id}
            className="mb-3 break-inside-avoid cursor-zoom-in overflow-hidden rounded-md group"
            onClick={() => setLightboxIndex(index)}
          >
            <div className="relative">
              <Image
                src={urlFor(item.image).width(600).quality(80).url()}
                alt={item.image.alt ?? item.title}
                width={600}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                style={{ display: "block" }}
              />
              {/* Caption overlay on hover */}
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-sm px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </>
  );
}