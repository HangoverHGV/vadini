import { useIntl } from 'react-intl';
import "../assets/css/Hero.css";
import welderImage from '../assets/images/welder.png';

export default function HeroSection(){
    const intl = useIntl();
    return <>
        <section className='hero-section'>
            <div className="content-container">
                <div className='text-content'>
                    <h1 className='main-title'>
                        <span className='title-highlight'>{intl.formatMessage({id: 'hero.precision'})}</span>
                        <br/>
                        {intl.formatMessage({id: "hero.steel_craft"})}
                    </h1>
                    <p className='subtitle'>
                        {intl.formatMessage({id: "hero.subtitle"})}
                    </p>
                </div>
                <div className='media-background'>
                    <img src={welderImage} alt="Welder Working" className='welding-image'/>
                </div>
            </div>
        </section>
    </>
}
