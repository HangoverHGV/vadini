import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import ProductsCarousel from '../components/ProductsCarousel';
import ProductDescription from '../components/ProductDescription';
import '../assets/css/ProductDescription.css';
import '../assets/css/Products.css';

const Product = () => {
    const intl = useIntl();

    // Get the products array from translations
    const productsData = useMemo(() => {
        const messages = intl.messages;
        return messages.products || [];
    }, [intl.messages]);

    // Get the first product (main product)
    const product = productsData[0] || {};

    return (
        <div className="products-page">

            {/* Products Carousel Section */}
            <section className="products-section">
                <ProductsCarousel 
                    title={product.title || 'Demolition Waste Container'}
                    imageFolder={product.imageFolder || 'container'}
                    productTitle={product.title}
                    product={product}
                />
            </section>

            {/* Product Description Section */}
            <section className="product-details-section">
                <div className="product-details-container">
                    <ProductDescription
                        title={product['description.title'] || 'Description'}
                        description={product.description || 'Product description'}
                    />
                    
                    <div className="product-specifications">
                        <h3>{product['dimensions.title'] || 'Dimensions'}</h3>
                        <div className="specifications-content">
                            <p>{product.dimensions || 'Dimensions'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="product-features-section">
                <h2>{product['features.title'] || 'Key Features'}</h2>
                <div className="features-grid">
                    {product.features && Array.isArray(product.features) ? (
                        product.features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.text}</p>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="feature-card">
                                <div className="feature-icon">🛡️</div>
                                <h3>High-Quality Materials</h3>
                                <p>Constructed from 5mm thick steel plates, reinforced with UPN 100 mm profiles for exceptional impact and abrasion resistance.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">⚙️</div>
                                <h3>Optimal Capacity</h3>
                                <p>4 cu.m volume, ideal for efficient handling of rubble and heavy demolition waste.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">�</div>
                                <h3>Robust Design</h3>
                                <p>Solid structure designed to withstand the toughest working conditions on site.</p>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Product;
