import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import getProducts from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const language = window.localStorage.getItem("language");
      const products = await getProducts({ language: language });
      setProducts(products);
    };
    fetchProducts();
  }, []);
  return (
    <>
      <div className="container product-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
