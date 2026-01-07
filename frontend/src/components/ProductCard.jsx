import { useEffect, useState } from "react";

export default function ProductCard({ product }) {
  const [productDetails, setProductDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      {productDetails && (
        <div>
          <p>Price: {productDetails.price}</p>
          <p>Stock: {productDetails.stock}</p>
        </div>
      )}
    </div>
  );
}
