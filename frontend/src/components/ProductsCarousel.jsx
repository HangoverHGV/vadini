import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // imports default styles
import '../assets/css/JourneyCarousel.css'; // imports our custom styles
import productsData from '../data/products.json';

const Slide = ({ item, imageFolder }) => {
    const intl = useIntl();
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const loadImage = async () => {
            let imageModule;
            try {
                // Try loading .png first
                imageModule = await import(`../assets/images/products/${imageFolder}/${item.imageKey}.png`);
            } catch (error) {
                // If .png fails, try loading .jpg
                imageModule = await import(`../assets/images/products/${imageFolder}/${item.imageKey}.jpg`);
            }
            setImageSrc(imageModule.default);
        };
        loadImage();
    }, [item.imageKey, imageFolder]);

    return (
        <div className="journey-slide">
            {imageSrc && (
                <img 
                    src={imageSrc} 
                    alt={intl.formatMessage({ id: item.titleId, defaultMessage: 'Product image' })} 
                    className="journey-slide-image" 
                />
            )}
            {/* <div className="text-overlay">
                <h2>{intl.formatMessage({ id: item.titleId })}</h2>
                <p>{intl.formatMessage({ id: item.textId })}</p>
            </div> */}
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
                {productsData.map(item => (
                    <Slide key={item.id} item={item} imageFolder={imageFolder} />
                ))}
            </Carousel>
        </section>
    );
};

export default ProductsCarousel;