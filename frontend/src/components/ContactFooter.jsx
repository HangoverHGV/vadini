import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import '../assets/css/ContactFooter.css';
import Envelope from '../assets/images/flags/helper_images.jsx'
import {WhatsApp, Phone} from '../assets/images/flags/helper_images.jsx'

export default function ContactFooter() {
    const intl = useIntl();

    // Replace with your actual email and phone number
    const emailAddress = 'contact@sudurasimontaj.com';
    const myEmailAddress = 'hangobogdan@sudurasimontaj.com' // TODO: Replace with actual email
    const phoneNumber = '+40773330210'; // TODO: Replace with actual phone number (include country code, no spaces or hyphens)

    return (
        <footer className="contact-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>{intl.formatMessage({ id: 'footer.contactUs' })}</h3>
                    <p>{intl.formatMessage({ id: 'footer.getInTouch' })}</p>
                </div>
                <div className="footer-section">
                    <h4>{intl.formatMessage({ id: 'footer.quickLinks' })}</h4>
                    <ul>
                        <li><Link to="/services">{intl.formatMessage({ id: 'nav.services' })}</Link></li>
                        <li><Link to="/contact">{intl.formatMessage({ id: 'nav.contact' })}</Link></li>
                        {/* Add more links as needed, e.g., to Home, About, etc. */}
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>{intl.formatMessage({ id: 'footer.reachOut' })}</h4>
                    <div className="social-links">
                        <a href={`mailto:${emailAddress}`} className="contact-link">
                            {Envelope}
                            {intl.formatMessage({ id: 'footer.emailUs' })}: <br/>{emailAddress}
                        </a>
                        <a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                            {WhatsApp}
                            {intl.formatMessage({ id: 'footer.whatsappUs' })}: <br/>{phoneNumber}
                        </a>
                        <a href={`tel:${phoneNumber}`} className="contact-link">
                            {Phone}
                            {intl.formatMessage({ id: 'footer.callUs' })}: <br/>{phoneNumber}
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
