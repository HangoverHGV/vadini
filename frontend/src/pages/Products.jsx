import { useIntl } from 'react-intl';
import ProductsCarousel from '../components/ProductsCarousel';
import ProductDescription from '../components/ProductDescription';

export default function Products() {
    const intl = useIntl();
    const containerDescription = intl.formatMessage({ id: 'products.container.description' });
    const containerTitle = intl.formatMessage({ id: 'products.container.title' });

    return <>

        <div className="container-black">
            <div className="container">
                <ProductsCarousel title={containerTitle} imageFolder="container" />
            </div>
        </div>
        <div className='container-white'>
            <div className='container'>
            <ProductDescription description={containerDescription} />

            </div>
        </div>
    </>;
}