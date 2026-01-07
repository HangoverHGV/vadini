import React, { useEffect, useState } from "react";
import { baseURL } from "../api/constants";
import "../assets/css/Products.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

/**
 * ProductCard
 *
 * - Renders product title + description
 * - Shows up to the first 10 unique images in a carousel (deduped by base name)
 * - When product provides small/medium/large variants, prefers large -> medium -> small
 * - Prepends `${baseURL}/api` to relative image paths and leaves absolute URLs intact
 * - Appends the user's language from localStorage as ?language=... when possible
 * - Uses native `loading="lazy"` on images and enables the carousel's `lazyLoad`
 *
 * Expected product.images entries:
 *   { id: 55, image_url: "/app/images/small/wallpaperflare_small.webp" }
 *   or absolute: "http://127.0.0.1:8002/api/app/images/large/..."
 *
 * Notes:
 * - The component does not depend on any global state; it reads `language` from localStorage.
 * - Styling is handled by ../assets/css/Products.css (which centers card internals).
 */

function safeGetLanguage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("language") || "";
    }
  } catch (e) {
    // ignore (e.g., SSR or blocked storage)
  }
  return "";
}

function makeAbsoluteAndAppendLang(rawUrl, lang) {
  if (!rawUrl) return "";

  // If absolute URL (http(s) or protocol-relative), use as-is and append language param
  if (/^(https?:)?\/\//i.test(rawUrl)) {
    try {
      const u = new URL(rawUrl);
      if (lang) u.searchParams.set("language", lang);
      return u.toString();
    } catch (e) {
      return rawUrl;
    }
  }

  // Otherwise treat as relative and prefix baseURL/api
  const base = (baseURL || "").replace(/\/$/, "");
  const path = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  const full = `${base}/api${path}`;
  try {
    const u = new URL(full);
    if (lang) u.searchParams.set("language", lang);
    return u.toString();
  } catch (e) {
    return full;
  }
}

/**
 * Given raw product.images array, group variants by a 'base name' to dedupe
 * Example filenames:
 *   screenshot_large.webp, screenshot_medium.webp, screenshot_small.webp
 *
 * We extract the base name by stripping the common suffix (_large/_medium/_small or -large/-medium/-small)
 * and group entries by that base. For each group choose preferred = large || medium || small || first.
 */
function dedupeAndSelect(images = [], maxItems = 10) {
  const groups = new Map(); // base -> { small, medium, large, original, order }

  images.forEach((item) => {
    if (!item || !item.image_url) return;
    const url = item.image_url;
    const filename = url.split("/").pop() || url;
    const nameNoExt = filename.replace(/\.[^.]+$/, "");

    // check path segments first for 'large'/'medium'/'small'
    const pathSegments = url.split("/").map((s) => (s || "").toLowerCase());
    const segMatch = pathSegments.find(
      (s) => s === "large" || s === "medium" || s === "small",
    );
    let sizeToken = segMatch || null;

    // fallback to filename suffix like name_large, name-medium, name_small
    const m = nameNoExt.match(/^(.*?)(?:[_-](large|medium|small))?$/i);
    const baseName = m && m[1] ? m[1] : nameNoExt;
    if (!sizeToken && m && m[2]) sizeToken = m[2].toLowerCase();

    const baseKey = baseName;

    if (!groups.has(baseKey)) {
      groups.set(baseKey, {
        base: baseKey,
        small: null,
        medium: null,
        large: null,
        original: null,
        order: groups.size,
      });
    }

    const entry = groups.get(baseKey);
    const token = (sizeToken || "original").toLowerCase();
    if (token === "large") entry.large = entry.large || url;
    else if (token === "medium") entry.medium = entry.medium || url;
    else if (token === "small") entry.small = entry.small || url;
    else entry.original = entry.original || url;
  });

  // Convert to ordered array and pick preferred url for each group
  const items = Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .slice(0, maxItems)
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

  return items;
}

export default function ProductCard({ product = {} }) {
  const [slides, setSlides] = useState([]);
  const language = safeGetLanguage();

  useEffect(() => {
    if (!product || !Array.isArray(product.images)) {
      setSlides([]);
      return;
    }

    const deduped = dedupeAndSelect(product.images, 10);

    // Normalize URLs (make absolute and append language)
    const normalized = deduped.map((it) => ({
      ...it,
      preferred: makeAbsoluteAndAppendLang(it.preferred, language),
      small: it.small ? makeAbsoluteAndAppendLang(it.small, language) : null,
      medium: it.medium ? makeAbsoluteAndAppendLang(it.medium, language) : null,
      large: it.large ? makeAbsoluteAndAppendLang(it.large, language) : null,
      original: it.original
        ? makeAbsoluteAndAppendLang(it.original, language)
        : null,
    }));

    setSlides(normalized);
  }, [product, language]);

  const title =
    (product.translations &&
      product.translations[0] &&
      product.translations[0].title) ||
    product.name ||
    "";
  const description =
    (product.translations &&
      product.translations[0] &&
      product.translations[0].description) ||
    product.description ||
    "";

  return (
    <div className="product-card" role="group" aria-label={title || "Product"}>
      {/* Carousel region */}
      <div className="product-images" style={{ width: "100%" }}>
        {slides.length === 0 ? (
          // fallback: show single image if available
          product.image ? (
            <img
              className="product-image--fallback"
              src={makeAbsoluteAndAppendLang(product.image, language)}
              alt={title || "product image"}
              loading="lazy"
              style={{
                width: "100%",
                maxWidth: 350,
                height: "auto",
                borderRadius: 8,
              }}
            />
          ) : (
            <div
              style={{
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
              }}
            >
              No images
            </div>
          )
        ) : (
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            useKeyboardArrows
            emulateTouch
            swipeable
            autoPlay={false}
            dynamicHeight={false}
            centerMode={false}
            showArrows
            lazyLoad
          >
            {slides.map((s, i) => (
              <div
                key={`${s.base}-${i}`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* main image: use preferred (large/medium/small) and provide srcSet with variants */}
                <img
                  src={s.preferred}
                  srcSet={[
                    s.small ? `${s.small} 400w` : null,
                    s.medium ? `${s.medium} 800w` : null,
                    s.large ? `${s.large} 1200w` : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  sizes="(max-width: 600px) 90vw, 350px"
                  alt={`${title || "Product"} - ${s.base}`}
                  loading="lazy"
                  style={{
                    maxHeight: 300,
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <Link className="product-link" to={`/products/${product.id}`}>
        {/* Title & Description centered by CSS */}
        <h3 className="product-title">{title}</h3>
      </Link>
    </div>
  );
}
