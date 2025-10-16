import { useIntl } from 'react-intl';
import '../assets/css/AboutUs.css';





export default function AboutUs(){
    const intl = useIntl();

    return<>
    <div className="container">
        <div className="container-black">
            <p className='about-us-description'>
                        {intl.formatMessage({id: "about.description"})}
             </p>
        </div>

    </div>
    </>
}
