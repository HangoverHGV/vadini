import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // imports default styles
import '../assets/css/JourneyCarousel.css'; // imports our custom styles

// Import all product images
const imageModules = import.meta.glob('../assets/images/products/container/*.{jpg,png}', { eager: true });

// Helper function to get image path
const getImagePath = (imageNumber, imageFolder) => {
    const pathPng = `../assets/images/products/${imageFolder}/product-image-${imageNumber}.png`;
    const pathJpg = `../assets/images/products/${imageFolder}/product-image-${imageNumber}.jpg`;
    
    return imageModules[pathPng]?.default || imageModules[pathJpg]?.default || null;
};

const Slide = ({ imageNumber, imageFolder, productTitle }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const imagePath = getImagePath(imageNumber, imageFolder);
        setImageSrc(imagePath);
    }, [imageNumber, imageFolder]);

    return (
        <div className="journey-slide">
            {imageSrc && (
                <img 
                    src={imageSrc} 
                    alt={`${productTitle} - Image ${imageNumber}`} 
                    className="journey-slide-image" 
                />
            )}
        </div>
    );
};

const ProductsCarousel = ({ title, imageFolder, productTitle, product = {} }) => {
    const intl = useIntl();

    // Generate slide array based on available images for this product
    const slides = useMemo(() => {
        const slideArray = [];
        let imageNumber = 1;
        let found = true;

        // Try to find consecutive images up to a reasonable limit
        while (found && imageNumber <= 20) {
            const imagePath = getImagePath(imageNumber, imageFolder);
            if (imagePath) {
                slideArray.push(imageNumber);
                imageNumber++;
            } else {
                found = false;
            }
        }

        // If no images found, return empty array
        return slideArray.length > 0 ? slideArray : [];
    }, [imageFolder]);

    return (
        <section className="journey-carousel-section">
            <h1 className="journey-title">{title}</h1>
            {slides.length > 0 ? (
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    useKeyboardArrows={true}
                    autoPlay={false}
                    interval={5000}
                    dynamicHeight={true}
                >
                    {slides.map((imageNumber) => (
                        <Slide 
                            key={imageNumber} 
                            imageNumber={imageNumber} 
                            imageFolder={imageFolder} 
                            productTitle={productTitle} 
                        />
                    ))}
                </Carousel>
            ) : (
                <div className="no-images-message">
                    <p>No product images available</p>
                </div>
            )}
        </section>
    );
};

export default ProductsCarousel;