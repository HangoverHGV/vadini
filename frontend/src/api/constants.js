import axios from "axios";
const isProduction = import.meta.env.PROD;
let baseURL = isProduction
  ? "https://api.sudurasimontaj.com"
  : "http://localhost:8002";

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
