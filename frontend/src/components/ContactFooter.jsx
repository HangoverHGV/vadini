import { useIntl } from 'react-intl';
import '../assets/css/ContactFooter.css';
import Envelope from '../assets/images/flags/helper_images.jsx'
import {WhatsApp, Phone, Location} from '../assets/images/flags/helper_images.jsx'

export default function ContactFooter() {
    const intl = useIntl();

    // Replace with your actual email and phone number
    const emailAddress = 'contact@sudurasimontaj.com';
    const myEmailAddress = 'hangobogdan@sudurasimontaj.com' 
    const phoneNumber = '+40773330210'; 

    return (
        <footer id="contact" className="contact-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>{intl.formatMessage({ id: 'footer.contactUs' })}</h3>
                    <p>{intl.formatMessage({ id: 'footer.getInTouch' })}</p>
                </div>
                {/* <div className="footer-section"> */}
                    {/* <h4>{intl.formatMessage({ id: 'footer.quickLinks' })}</h4> */}
                    {/* <ul> */}
                        {/* <li><a href="/products">{intl.formatMessage({ id: 'nav.products' })}</a></li> */}
                        {/* Add more links as needed, e.g., to Home, About, etc. */}
                    {/* </ul> */}
                {/* </div> */}
                <div className="footer-section">
                    <h4>{intl.formatMessage({ id: 'footer.reachOut' })}</h4>
                    <div className="social-links">
                        <a href={`mailto:${emailAddress}`} className="contact-link">
                            {Envelope} 
                            <div>
                                {intl.formatMessage({ id: 'footer.emailUs' })}:
                                <p>{emailAddress}</p>
                            </div>
                        </a>
                        <a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                            {WhatsApp} 
                            <div>
                                {intl.formatMessage({ id: 'footer.whatsappUs' })}:
                                <p>{phoneNumber}</p>
                            </div>
                        </a>
                        <a href={`tel:${phoneNumber}`} className="contact-link">
                            {Phone} 
                            <div>
                                {intl.formatMessage({ id: 'footer.callUs' })}:
                                <p>{phoneNumber}</p>
                            </div>
                        </a>
                        <a href='https://maps.app.goo.gl/Cg9rA1FfZGkf4XSK7' className='contact-link'>
                            {Location} 
                            <div>
                                {intl.formatMessage({ id: 'footer.address' })}:
                                <p>{intl.formatMessage({ id: 'footer.location' })}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {intl.formatMessage({ id: 'footer.companyName' })}. {intl.formatMessage({ id: 'footer.allRightsReserved' })}</p>
            </div>
        </footer>
    );
}
