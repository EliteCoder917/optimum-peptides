"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-secondary/40" aria-hidden="true" />
    );
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-black/10">
        <img
          src={images[active]}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              className={`aspect-square overflow-hidden rounded-lg border transition-colors ${
                active === index ? "border-primary" : "border-border"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
