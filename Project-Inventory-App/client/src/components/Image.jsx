import { useState } from "react";

export default function Image({ 
  src, 
  alt, 
  fallback = "/fallback.png", 
  className = "w-24 h-24" // default 96 × 96px
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-primary/10" />
      )}

      <img
        src={failed ? fallback : src}
        alt={alt}
        loading="lazy"
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}