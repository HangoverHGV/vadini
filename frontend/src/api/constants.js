import axios from "axios";
const isProduction = import.meta.env.PROD;
let baseURL = (() => {
  // Allow an environment override (Vite): VITE_API_URL
  // Force HTTPS when appropriate (production + api.sudurasimontaj.com) and
  // fall back to localhost in development.
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    try {
      // If running in a browser, normalize relative URLs against the current location.
      const base =
        typeof window !== "undefined" ? window.location.href : undefined;
      const u = new URL(envUrl, base);
      // If the current page is HTTPS and the API host is api.sudurasimontaj.com, ensure HTTPS.
      if (
        typeof window !== "undefined" &&
        window.location.protocol === "https:" &&
        u.hostname === "api.sudurasimontaj.com"
      ) {
        u.protocol = "https:";
      }
      // Remove trailing slash for consistency
      return u.toString().replace(/\/$/, "");
    } catch (e) {
      // If URL parsing fails, fall back to the raw env value
      return envUrl;
    }
  }

  if (isProduction) {
    // Always use HTTPS for the public API in production
    return "https://api.sudurasimontaj.com/";
  }

  // Local development default
  return "http://localhost:8002";
})();

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("text/html")) {
      // If we get HTML, it's likely a 404 fallback from the server.
      // Reject the promise to treat it as an error.
      return Promise.reject(
        new Error("Server returned HTML instead of API data."),
      );
    }
    return response;
  },
  (error) => {
    // Pass through other errors
    return Promise.reject(error);
  },
);
export default apiClient;
export { baseURL };
