import apiClient from "./constants";

export default async function getProducts(params = {}) {
  const { data } = await apiClient.get("/products", { params });
  return data;
}

export async function getProductDetails(productId) {
  const { data } = await apiClient.get(`/products/${productId}`);
  return data;
}
