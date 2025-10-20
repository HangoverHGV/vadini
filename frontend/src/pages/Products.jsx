import { useIntl } from 'react-intl';
import ProductsCarousel from '../components/ProductsCarousel';
import ProductDescription from '../components/ProductDescription';

export default function Products() {
    const intl = useIntl();
    const containerDescriptionTitle = intl.formatMessage({ id: 'products.container.description.title' });
    const containerDescription = intl.formatMessage({ id: 'products.container.description' });
    const containerDimensions = intl.formatMessage({ id: 'products.container.dimensions' });
    const containerDimensionsTitle = intl.formatMessage({ id: 'products.container.dimensions.title' });
    const containerTitle = intl.formatMessage({ id: 'products.container.title' });

    return <>
        {/* --- Standard SEO Meta Tags (React 19) --- */}
        <title>{intl.formatMessage({ id: 'products.meta.title' })}</title>
        <meta name="description" content={intl.formatMessage({ id: 'products.meta.description' })} />
        <link rel="canonical" href="https://www.sudurasimontaj.com/products" />

        {/* --- Open Graph / Facebook / LinkedIn Meta Tags --- */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://www.sudurasimontaj.com/products" />
        <meta property="og:title" content={intl.formatMessage({ id: 'products.meta.title' })} />
        <meta property="og:description" content={intl.formatMessage({ id: 'products.meta.description' })} />
        <meta property="og:image" content="https://www.sudurasimontaj.com/images/container/container-social.jpg" />

        {/* --- Structured Data (JSON-LD for Product) --- */}
        {/* This helps Google show rich results for your product. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": containerTitle,
            "image": [
              "https://www.sudurasimontaj.com/images/container/image1.jpg",
              "https://www.sudurasimontaj.com/images/container/image2.jpg"
             ],
            "description": containerDescription,
            "sku": "CONTAINER-MOL-01",
            "brand": {
              "@type": "Brand",
              "name": "Sudura si Montaj"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://www.sudurasimontaj.com/products",
              "priceCurrency": "RON",
              "price": "0", // Use "0" if price varies; link to contact for quote
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "Sudura si Montaj"
              }
            }
          })}
        </script>

        <div className="container-black">
            <div className="container">
                <ProductsCarousel title={containerTitle} imageFolder="container" />
            </div>
        </div>
        <div className='container-white'>
            <div className='container'>
            <ProductDescription description={containerDescription} title={containerDescriptionTitle} />
            </div>
        </div>
        <div className='container-black'>
            <div className='container'>
                <ProductDescription description={containerDimensions} title={containerDimensionsTitle} />
            </div>
        </div>
    </>;
}