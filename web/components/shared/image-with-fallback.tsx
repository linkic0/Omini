"use client";

import { useState, type ImgHTMLAttributes } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

export function ImageWithFallback(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  const [didError, setDidError] = useState(false);
  const { src, alt, className, style, ...rest } = props;

  if (didError) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-gray-100 ${className ?? ""}`}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Error loading image" data-original-url={src} src={ERROR_IMG_SRC} {...rest} />
    </div>
  );
}

  return (
    // Plain img keeps the fallback flow simple for local and downloaded assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={className}
      src={src}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}
