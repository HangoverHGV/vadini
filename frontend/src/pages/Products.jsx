import { useIntl } from "react-intl";
import { useState, useEffect } from "react";
import ProductsCarousel from "../components/ProductsCarousel";
import ProductDescription from "../components/ProductDescription";
import getProducts from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const intl = useIntl();
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
      console.log(products);
    };
    fetchProducts();
  }, []);
  return <></>;
}
