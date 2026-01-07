import { useEffect, useState } from "react";
import { baseURL } from "../api/constants";
import "../assets/css/Products.css";

/**
 * ProductCard
 * - Shows product title
 * - Displays first 10 unique images (deduped by base name across sizes)
 * - Prefers large -> medium -> small for the main src, and exposes a srcSet
 * - Uses native lazy-loading (`loading="lazy"`)
 *
 * Expected `product.images` shape:
 * [
 *   { id: 55, image_url: "/app/images/small/wallpaperflare_small.webp" },
 *   { id: 56, image_url: "/app/images/medium/wallpaperflare_medium.webp" },
 *   { id: 57, image_url: "/app/images/large/wallpaperflare_large.webp" }
 * ]
 *
 * Deduping logic:
 * - Extract base name (remove extension and trailing "_small|_medium|_large" or "-small|-medium|-large")
 * - Group images by base name, keep references to small/medium/large when present
 * - For each base choose preferred url (large -> medium -> small -> first)
 */

export default function ProductCard({ product }) {
  const [availableImages, setAvailableImages] = useState([]);

  // Helper: ensure URLs are absolute (prepend baseURL if relative)
  const normalizeUrl = (url) => {
    return `${baseURL}/api${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Build srcSet string from sizes found
  const buildSrcSet = (sizes) => {
    // approximate width descriptors
    const srcs = [];
    if (sizes.small) srcs.push(`${normalizeUrl(sizes.small)} 400w`);
    if (sizes.medium) srcs.push(`${normalizeUrl(sizes.medium)} 800w`);
    if (sizes.large) srcs.push(`${normalizeUrl(sizes.large)} 1200w`);
    // fallback to any other available url without descriptor
    if (sizes.original && srcs.length === 0)
      srcs.push(`${normalizeUrl(sizes.original)} 800w`);
    return srcs.join(", ");
  };

  useEffect(() => {
    if (!product || !Array.isArray(product.images)) {
      setAvailableImages([]);
      return;
    }

    // Group images by base name
    const groups = new Map();
    // Preserve insertion order by iterating product.images
    for (const img of product.images) {
      if (!img || !img.image_url) continue;

      const url = img.image_url;

      const filename = url.split("/").pop() || url;

      // remove extension
      const nameNoExt = filename.replace(/\.[^.]+$/, "");
      // Determine size token from path segments (e.g., .../large/...) or filename suffix
      let sizeToken = "original";
      const pathSegments = url.split("/").map((s) => (s || "").toLowerCase());
      // check for explicit segment like 'small', 'medium', 'large'
      const segMatch = pathSegments.find(
        (s) => s === "small" || s === "medium" || s === "large",
      );
      if (segMatch) {
        sizeToken = segMatch;
      } else {
        // fallback to filename suffix (e.g. name_small.webp)
        const m = nameNoExt.match(/^(.*?)(?:[_-](small|medium|large))?$/i);
        if (m && m[2]) sizeToken = m[2].toLowerCase();
      }
      // compute base name by removing the size suffix if present
      const baseMatch = nameNoExt.match(
        /^(.*?)(?:[_-](small|medium|large))?$/i,
      );
      const base = baseMatch ? baseMatch[1] : nameNoExt;

      if (!groups.has(base))
        groups.set(base, {
          base,
          small: null,
          medium: null,
          large: null,
          original: null,
          order: groups.size,
        });
      const entry = groups.get(base);

      if (sizeToken === "small") entry.small = url;
      else if (sizeToken === "medium") entry.medium = url;
      else if (sizeToken === "large") entry.large = url;
      else entry.original = entry.original || url; // keep first seen original if any
    }

    // Convert to array ordered by first occurrence, choose preferred url (large->medium->small->original)
    const imgs = Array.from(groups.values())
      .sort((a, b) => a.order - b.order)
      .slice(0, 10) // first 10 unique base images
      .map((entry) => {
        const preferred =
          entry.large || entry.medium || entry.small || entry.original || "";
        return {
          base: entry.base,
          small: entry.small,
          medium: entry.medium,
          large: entry.large,
          original: entry.original,
          preferred,
        };
      });
    setAvailableImages(imgs);
  }, [product]);
  const productTitle = product.translations[0].title;
  const productDescription = product.translations[0].description;

  return (
    <div className="product-card">
      <div
        className="product-images"
        style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
      >
        {availableImages.length === 0 && product?.image && (
          // Fallback: single `product.image` if provided by API
          <img
            src={normalizeUrl(product.image)}
            alt={product?.name || "product image"}
            loading="lazy"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        )}

        {availableImages.map((img, idx) => (
          <figure key={`${img.base}-${idx}`}>
            <img
              src={normalizeUrl(img.preferred)}
              srcSet={buildSrcSet(img)}
              sizes="(max-width: 600px) 33vw, 120px"
              loading="lazy"
              alt={`${productTitle || "Product"} - ${img.base}`}
            />
          </figure>
        ))}
      </div>
      <h3 className="product-title">{productTitle}</h3>

      {productDescription && (
        <p className="product-description">{productDescription}</p>
      )}
    </div>
  );
}
