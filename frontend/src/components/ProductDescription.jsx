import React from 'react';
import '../assets/css/ProductDescription.css';

const ProductDescription = ({ description }) => {
    return (
        <div className="product-description-container">
            <p className="product-description-text">
                {description}
            </p>
        </div>
    );
};

export default ProductDescription;