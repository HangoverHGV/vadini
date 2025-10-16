
import { useIntl } from 'react-intl';
import HeroSection from '../components/HeroSection';
import CapabilitiesSection from '../components/CapabilitiesSection';

export default function Home(){
    const intl = useIntl();

    return <>
        <div className='container-black'>
            <div className='container'>
                <HeroSection/>
            </div>
        </div>
        <div className='container-white'>
            <div className='container'>
                <CapabilitiesSection/>
            </div>
        </div>
    </>
}
