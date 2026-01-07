import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { getProductDetails } from "../api/products";
import { baseURL } from "../api/constants";
import "../assets/css/Products.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

/**
 * ProductDetails page
 * - Fetches product details by id
 * - Re-fetches when the locale changes
 * - Displays title, description and an image carousel (deduped similar to ProductCard)
 *
 * Image handling:
 * - Dedupes images by base filename (removing _small/_medium/_large or -small/-medium/-large)
 * - Prefers large -> medium -> small -> original for display
 * - Converts relative URLs to absolute by prefixing `${baseURL}/api`
 * - Appends the language query param (from intl.locale or localStorage) where possible
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
  // Absolute URLs: leave them but append language query param
  if (/^(https?:)?\/\//i.test(rawUrl)) {
    try {
      const u = new URL(rawUrl);
      if (lang) u.searchParams.set("language", lang);
      return u.toString();
    } catch (e) {
      return rawUrl;
    }
  }

  // Relative: prefix baseURL + /api
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

function dedupeAndSelect(images = [], maxItems = 10) {
  const groups = new Map();

  images.forEach((item) => {
    if (!item || !item.image_url) return;
    const url = item.image_url;
    const filename = url.split("/").pop() || url;
    const nameNoExt = filename.replace(/\.[^.]+$/, "");

    // detect size from path or filename suffix
    const pathSegments = url.split("/").map((s) => (s || "").toLowerCase());
    const segMatch = pathSegments.find(
      (s) => s === "large" || s === "medium" || s === "small"
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

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [slides, setSlides] = useState([]);
  const intl = useIntl();
  const language = safeGetLanguage(intl?.locale);

  useEffect(() => {
    let mounted = true;

    const fetchDetails = async () => {
      try {
        const prod = await getProductDetails(id, { language });
        if (mounted) setProduct(prod || null);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        if (mounted) setProduct(null);
      }
    };

    if (id) fetchDetails();

    return () => {
      mounted = false;
    };
    // Re-fetch if id or language changes
  }, [id, language, intl.locale]);

  useEffect(() => {
    if (!product) {
      setSlides([]);
      return;
    }
    const images = Array.isArray(product.images) ? product.images : [];
    const deduped = dedupeAndSelect(images, 10);

    const normalized = deduped.map((it) => ({
      ...it,
      preferred: makeAbsoluteAndAppendLang(it.preferred, language),
      small: it.small ? makeAbsoluteAndAppendLang(it.small, language) : null,
      medium: it.medium
        ? makeAbsoluteAndAppendLang(it.medium, language)
        : null,
      large: it.large ? makeAbsoluteAndAppendLang(it.large, language) : null,
      original: it.original