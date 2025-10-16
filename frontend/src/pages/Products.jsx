import { useIntl } from 'react-intl';
import ProductsCarousel from '../components/ProductsCarousel';
import ProductDescription from '../components/ProductDescription';

export default function Products() {
    const intl = useIntl();
    const containerDescription = intl.formatMessage({ id: 'products.container.description' });
    const containerTitle = intl.formatMessage({ id: 'products.container.title' });

    return (
        <div className="container">
        <div className="container-white">
            <ProductsCarousel title={containerTitle} imageFolder="container" />
        </div>
        <div className='container-black'>
            <ProductDescription description={containerDescription} />
        </div>
        </div>
    );
}