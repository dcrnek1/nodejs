import { useMemo, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function Image({
  src,
  alt,
  fallback = "/fallback.png",
  className = "w-24 h-24", // default 96 × 96px
} = {}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  const isCached = useMemo(() => {
    if (!src) return true;
    const img = new window.Image();
    img.src = src;
    return img.complete;
  }, [src]);

  const [loaded, setLoaded] = useState(isCached);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton */}
      {}

      
    <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        ref={imgRef}
        src={failed ? fallback : src}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="lazy"
        className={`
          w-full h-full object-cover transition-opacity duration-10 object-cover
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
