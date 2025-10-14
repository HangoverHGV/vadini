
import { useIntl } from 'react-intl';
import HeroSection from '../components/HeroSection';

export default function Home(){
    const intl = useIntl();

    return <>
        <div style={{backgroundColor: 'black'}}>
            <div className='container'>

                <HeroSection/>
            </div>
        </div>
    </>
}
