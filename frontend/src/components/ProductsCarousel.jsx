import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // imports default styles
import '../assets/css/JourneyCarousel.css'; // imports our custom styles
import productsData from '../data/products.json';

const Slide = ({ item, imageFolder, isFirstSlide }) => {
    const intl = useIntl();
    // We'll assume the images are JPGs for simplicity. If you have mixed types,
    // it's best to include the extension in your products.json data.
    const imageSrc = `/src/assets/images/products/${imageFolder}/${item.imageKey}.${item.imageExtension}`;

    return (
        <div className="journey-slide">
            <img 
                src={imageSrc} 
                alt={intl.formatMessage({ id: item.titleId, defaultMessage: 'Product image' })} 
                className="journey-slide-image"
                // Add the loading attribute.
                // Load the first image eagerly so it's visible immediately.
                // Lazy load all subsequent images in the carousel.
                loading={isFirstSlide ? 'eager' : 'lazy'}
                // Providing dimensions helps the browser reserve space and
                // prevents content from jumping as images load.
                width="800"
                height="600"
            />
        </div>
    );
};

const ProductsCarousel = ({ title, imageFolder }) => {
    const intl = useIntl();

    return (
        <section className="journey-carousel-section">
            <h1 className="journey-title">{title}</h1>
            <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop={true}
                useKeyboardArrows={true}
                autoPlay={false}
                interval={5000}
                dynamicHeight={true}
            >
                {productsData.map((item, index) => (
                    <Slide key={item.id} item={item} imageFolder={imageFolder} isFirstSlide={index === 0} />
                ))}
            </Carousel>
        </section>
    );
};

export default ProductsCarousel;