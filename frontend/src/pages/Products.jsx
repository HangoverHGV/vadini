import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import ProductCard from "../components/ProductCard";
import getProducts from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const intl = useIntl();
  // Use react-intl's locale so when language changes (via IntlProvider) this component reacts
  const locale = intl?.locale || window.localStorage.getItem("language") || "";

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      const language = locale;
      try {
        const prods = await getProducts({ language });
        if (mounted) setProducts(prods);
      } catch (err) {
        if (mounted) {
          // optional: setProducts([]) or handle error state
          console.error("Failed to fetch products:", err);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [locale]);

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
