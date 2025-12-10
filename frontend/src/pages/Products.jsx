import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import '../assets/css/ProductsList.css';

// Import all product images
const imageModules = import.meta.glob('../assets/images/products/container/*.{jpg,png}', { eager: true });

// Helper function to get image path
const getImagePath = (index, imageFolder = 'container') => {
    const imageNumber = index + 1;
    const pathPng = `../assets/images/products/${imageFolder}/product-image-${imageNumber}.png`;
    const pathJpg = `../assets/images/products/${imageFolder}/product-image-${imageNumber}.jpg`;
    
    return imageModules[pathPng]?.default || imageModules[pathJpg]?.default || null;
};

const ProductCard = ({ product, index, imageFolder = 'container' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Load all available images for this product
    const [availableImages, setAvailableImages] = useState([]);

    useEffect(() => {
        try {
            const images = [];
            let imageCounter = 1;
            let found = true;

            // Find all consecutive images for this product
            while (found && imageCounter <= 10) {
                const imagePng = `../assets/images/products/${imageFolder}/product-image-${imageCounter}.png`;
                const imageJpg = `../assets/images/products/${imageFolder}/product-image-${imageCounter}.jpg`;
                
                const imagePath = imageModules[imagePng]?.default || imageModules[imageJpg]?.default;
                
                if (imagePath) {
                    images.push(imagePath);
                    imageCounter++;
                } else {
                    found = false;
                }
            }

            // If no consecutive images found, just get the product's first image
            if (images.length === 0) {
                const mainImage = getImagePath(index, imageFolder);
                if (mainImage) images.push(mainImage);
            }

            setAvailableImages(images);
            setImageSrc(images[0] || null);
        } catch (error) {
            console.warn(`Could not load images for product at index ${index}:`, error);
            setAvailableImages([]);
            setImageSrc(null);
        } finally {
            setIsLoading(false);
        }
    }, [index, imageFolder]);

    // Handle swipe
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && availableImages.length > 1) {
            // Swipe left - next image
            setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
            setImageSrc(availableImages[(currentImageIndex + 1) % availableImages.length]);
        }
        if (isRightSwipe && availableImages.length > 1) {
            // Swipe right - previous image
            setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
            setImageSrc(availableImages[(currentImageIndex - 1 + availableImages.length) % availableImages.length]);
        }
    };

    const handlePrevImage = () => {
        const newIndex = (currentImageIndex - 1 + availableImages.length) % availableImages.length;
        setCurrentImageIndex(newIndex);
        setImageSrc(availableImages[newIndex]);
    };

    const handleNextImage = () => {
        const newIndex = (currentImageIndex + 1) % availableImages.length;
        setCurrentImageIndex(newIndex);
        setImageSrc(availableImages[newIndex]);
    };

    return (
        <Link to={`/products/${index}`} className="product-card-link">
            <div className="product-card">
                <div 
                    className="product-card-image-container"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {isLoading ? (
                        <div className="product-card-skeleton"></div>
                    ) : imageSrc ? (
                        <>
                            <img 
                                src={imageSrc} 
                                alt={product.title}
                                className="product-card-image"
                            />
                            {availableImages.length > 1 && (
                                <>
                                    <button 
                                        className="carousel-button carousel-button-prev"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePrevImage();
                                        }}
                                        aria-label="Previous image"
                                    >
                                        ❮
                                    </button>
                                    <button 
                                        className="carousel-button carousel-button-next"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNextImage();
                                        }}
                                        aria-label="Next image"
                                    >
                                        ❯
                                    </button>
                                    <div className="carousel-indicators">
                                        {availableImages.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentImageIndex(idx);
                                                    setImageSrc(availableImages[idx]);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="product-card-placeholder">
                            <span>No Image</span>
                        </div>
                    )}
                </div>
                <div className="product-card-content">
                    <h3 className="product-card-title">{product.title}</h3>
                    <p className="product-card-description">{product.description?.substring(0, 80)}...</p>
                    <div className="product-card-footer">
                        <span className="view-details">View Details →</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Products = () => {
    const intl = useIntl();

    // Get the products array from translations
    const productsData = useMemo(() => {
        const messages = intl.messages;
        return messages.products || [];
    }, [intl.messages]);

    // Get the products info object from translations
    const productsInfo = useMemo(() => {
        const messages = intl.messages;
        return messages['products.info'] || {};
    }, [intl.messages]);

    return (
        <div className="products-list-page">
            {/* Hero Section */}
            <section className="products-hero">
                <div className="products-hero-content">
                    <h1>{intl.formatMessage({ id: 'products.meta.title', defaultMessage: 'Our Products' })}</h1>
                    <p>{intl.formatMessage({ id: 'products.meta.description', defaultMessage: 'Explore our premium range of industrial products' })}</p>
                </div>
            </section>

            {/* Products Grid Section */}
            <section className="products-grid-section">
                <div className="products-container">
                    <h2 className="section-title">{intl.formatMessage({ id: 'products.all', defaultMessage: 'All Products' })}</h2>
                    <p className="section-subtitle">{intl.formatMessage({ id: 'products.impulse', defaultMessage: 'Click on any product to view detailed specifications and information' })}</p>
                    
                    <div className="products-grid">
                        {productsData && productsData.length > 0 ? (
                            productsData.map((product, index) => (
                                <ProductCard 
                                    key={index} 
                                    product={product}
                                    index={index}
                                    imageFolder={product.imageFolder || 'container'}
                                />
                            ))
                        ) : (
                            <p className="no-products">{intl.formatMessage({ id: 'products.none', defaultMessage: 'No products available' })}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Info Banner */}
            <section className="products-info-banner">
                <div className="info-content">
                    <h3>{productsInfo?.title || intl.formatMessage({ id: 'products.info.title', defaultMessage: 'Need a Custom Solution?' })}</h3>
                    <p>{productsInfo?.text || intl.formatMessage({ id: 'products.info.text', defaultMessage: "Don't see what you're looking for? Contact us for tailored metalworking solutions to meet your specific needs." })}</p>
                    <Link to="/contact" className="info-banner-button">{productsInfo?.['button.title'] || intl.formatMessage({ id: 'products.info.button.title', defaultMessage: 'Contact Us' })}</Link>
                </div>
            </section>
        </div>
    );
};

export default Products;
