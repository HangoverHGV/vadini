import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { getProductDetails } from "../api/products";
import { baseURL } from "../api/constants";
import "../assets/css/Products.css";
import "../assets/css/ProductDescription.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

/**
 * ProductDetails.jsx
 *
 * - Fetches product details (reacts to locale changes)
 * - Shows image carousel (deduped by base filename across sizes)
 * - Provides three tabs: Images, Description, Specifications
 * - Specifications tab renders a flexible features/specs list
 *
 * Notes:
 * - getProductDetails(productId, { language }) is used to fetch the product.
 * - Image URL normalization: absolute URLs are preserved; relative paths are prefixed
 *   with `${baseURL}/api`. Where possible language is appended as `?language=...`.
 */

function safeGetLanguage(intlLocale) {
  if (intlLocale) return intlLocale;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("language") || "";
    }
  } catch (e) {
    // ignore
  }
  return "";
}

function makeAbsoluteAndAppendLang(rawUrl, lang) {
  if (!rawUrl) return "";
  // If it's already absolute (http/https or protocol-relative), append language query param if present
  if (/^(https?:)?\/\//i.test(rawUrl)) {
    try {
      const u = new URL(rawUrl);
      if (lang) u.searchParams.set("language", lang);
      return u.toString();
    } catch (e) {
      // fallback to raw string if URL parsing fails
      return rawUrl;
    }
  }

  // Otherwise treat it as relative and prefix baseURL + /api
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
 * Dedupe images by base name:
 * - Removes suffixes like _small/_medium/_large or -small/-medium/-large
 * - Prefers large -> medium -> small -> original
 */
function dedupeAndSelect(images = [], maxItems = 10) {
  const groups = new Map();

  images.forEach((item) => {
    if (!item || !item.image_url) return;
    const url = item.image_url;
    const filename = url.split("/").pop() || url;
    const nameNoExt = filename.replace(/\.[^.]+$/, "");

    // detect size from path segments or filename suffix
    const pathSegments = url.split("/").map((s) => (s || "").toLowerCase());
    const segMatch = pathSegments.find(
      (s) => s === "large" || s === "medium" || s === "small",
    );
    let sizeToken = segMatch || null;

    const m = nameNoExt.match(/^(.*?)(?:[_-](large|medium|small))?$/i);
    const baseName = (m && m[1]) || nameNoExt;
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

/**
 * Render features/specs list. Accepts:
 * - array of strings
 * - array of objects { name, value } or other object shapes
 * - object of key->value (will be converted)
 */
function RenderFeatures({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="product-specs-empty">No specifications available.</div>
    );
  }

  return (
    <ul
      className="product-specs-list"
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {items.map((it, idx) => {
        if (typeof it === "string") {
          return (
            <li key={idx} className="product-specs-row">
              {it}
            </li>
          );
        }

        if (it && typeof it === "object") {
          // Common pair shape
          const name = it.name || it.key || it.title || it.label || null;
          const value = it.value || it.val || it.text || it.description || null;

          if (name && value !== null && value !== undefined) {
            return (
              <li key={idx} className="product-specs-row">
                <div className="spec-name">{name}</div>
                <div className="spec-value">{String(value)}</div>
              </li>
            );
          }

          // Otherwise render all key/value pairs
          const entries = Object.entries(it);
          return (
            <li key={idx} className="product-specs-row">
              {entries.map(([k, v]) => (
                <div key={k} className="spec-entry">
                  <strong className="spec-entry-key">{k}:</strong>{" "}
                  <span className="spec-entry-val">{String(v)}</span>
                </div>
              ))}
            </li>
          );
        }

        return null;
      })}
    </ul>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const intl = useIntl();
  const locale = safeGetLanguage(intl?.locale);

  const [product, setProduct] = useState(null);
  const [slides, setSlides] = useState([]);
  const [tab, setTab] = useState("images"); // 'images' | 'description' | 'specs'
  const carouselRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      try {
        const res = await getProductDetails(id, { language: locale });
        if (mounted) setProduct(res || null);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        if (mounted) {
          setProduct(null);
        }
      }
    }
    if (id) fetch();
    return () => {
      mounted = false;
    };
  }, [id, locale, intl.locale]);

  useEffect(() => {
    if (!product) {
      setSlides([]);
      return;
    }

    const images = Array.isArray(product.images) ? product.images : [];
    const deduped = dedupeAndSelect(images, 10);

    const normalized = deduped.map((it) => ({
      ...it,
      preferred: makeAbsoluteAndAppendLang(it.preferred, locale),
      small: it.small ? makeAbsoluteAndAppendLang(it.small, locale) : null,
      medium: it.medium ? makeAbsoluteAndAppendLang(it.medium, locale) : null,
      large: it.large ? makeAbsoluteAndAppendLang(it.large, locale) : null,
      original: it.original
        ? makeAbsoluteAndAppendLang(it.original, locale)
        : null,
    }));

    setSlides(normalized);
  }, [product, locale]);

  if (!product) {
    return <div className="container">Loading...</div>;
  }

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

  // Determine features/specs from likely fields
  const rawFeatures = (() => {
    if (!product) return [];
    if (Array.isArray(product.features) && product.features.length)
      return product.features;
    if (Array.isArray(product.attributes) && product.attributes.length)
      return product.attributes;
    if (Array.isArray(product.specifications) && product.specifications.length)
      return product.specifications;
    if (product.properties && typeof product.properties === "object") {
      return Object.entries(product.properties).map(([k, v]) => ({
        name: k,
        value: v,
      }));
    }
    if (Array.isArray(product.specs) && product.specs.length)
      return product.specs;
    // Fallback: some APIs embed features inside translations or details
    if (product.details && Array.isArray(product.details))
      return product.details;
    return [];
  })();

  // If the user switches to the Images tab, autofocus the carousel for keyboard control.
  useEffect(() => {
    if (
      tab === "images" &&
      carouselRef.current &&
      carouselRef.current.container
    ) {
      const node = carouselRef.current.container;
      node.focus && node.focus();
    }
  }, [tab]);

  return (
    <div className="container" style={{ padding: 16 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>{title}</h1>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <button
            type="button"
            className={`tab-button ${tab === "images" ? "active" : ""}`}
            onClick={() => setTab("images")}
            aria-pressed={tab === "images"}
          >
            {intl.formatMessage({
              id: "product.images",
              defaultMessage: "Images",
            })}
          </button>

          <button
            type="button"
            className={`tab-button ${tab === "description" ? "active" : ""}`}
            onClick={() => setTab("description")}
            aria-pressed={tab === "description"}
          >
            {intl.formatMessage({
              id: "product.description",
              defaultMessage: "Description",
            })}
          </button>

          <button
            type="button"
            className={`tab-button ${tab === "specs" ? "active" : ""}`}
            onClick={() => setTab("specs")}
            aria-pressed={tab === "specs"}
          >
            {intl.formatMessage({
              id: "product.spects",
              defaultMessage: "Specifications",
            })}
          </button>
        </div>

        {/* Content */}
        <div style={{ marginBottom: 16 }}>
          {tab === "images" && (
            <div>
              {slides.length === 0 ? (
                product.image ? (
                  <img
                    src={makeAbsoluteAndAppendLang(product.image, locale)}
                    alt={title || "Product image"}
                    loading="lazy"
                    style={{
                      width: "100%",
                      maxWidth: 700,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#777",
                      borderRadius: 8,
                      background: "#f6f6f6",
                    }}
                  >
                    No images available
                  </div>
                )
              ) : (
                <Carousel
                  ref={carouselRef}
                  showThumbs={true}
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
                  thumbWidth={100}
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
                      <img
                        src={s.preferred}
                        srcSet={[
                          s.small ? `${s.small} 400w` : null,
                          s.medium ? `${s.medium} 800w` : null,
                          s.large ? `${s.large} 1200w` : null,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                        sizes="(max-width: 600px) 90vw, 800px"
                        alt={`${title || "Product"} - ${s.base}`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          maxHeight: 600,
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          )}

          {tab === "description" && (
            <div className="product-description-container">
              <h2>
                {intl.formatMessage({
                  id: "product.description",
                  defaultMessage: "Description",
                })}
              </h2>
              <div
                className="product-description-text"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {description}
              </div>
            </div>
          )}

          {tab === "specs" && (
            <div className="product-specs-container">
              <h2>
                {intl.formatMessage({
                  id: "product.spects",
                  defaultMessage: "Specifications",
                })}
              </h2>
              <RenderFeatures items={rawFeatures} />
            </div>
          )}
        </div>

        {/* Additional product details could go here (price, variants, actions) */}
      </div>
    </div>
  );
}
