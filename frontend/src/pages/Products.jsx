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