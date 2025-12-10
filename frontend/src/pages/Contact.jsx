import React, { useState } from 'react';
import { useIntl, IntlProvider } from 'react-intl';
import '../assets/css/Contact.css';

// Utility to flatten nested locale JSON
function flattenMessages(nestedMessages, prefix = '') {
    return Object.keys(nestedMessages).reduce((messages, key) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
            Object.assign(messages, flattenMessages(value, prefixedKey));
        } else {
            messages[prefixedKey] = value;
        }
        return messages;
    }, {});
}

const ContactContent = () => {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setSubmitted(false);
        }, 3000);
    };
    const pageTitle = intl.formatMessage({ id: 'contact.title' });
    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>{pageTitle}</h1>
                    <p>{intl.formatMessage({ id: 'contact.description.meta' })}</p>
                </div>
            </section>
            <section className="contact-section">
                <div className="contact-container">
                    {/* Contact Form */}
                    <div className="contact-form-wrapper" style={{ display: 'none'}}>
                        <h2>{intl.formatMessage({ id: 'contact.contactForm.title' })}</h2>
                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">✓</div>
                                <h3>{intl.formatMessage({ id: 'contact.contactForm.success', defaultMessage: 'Thank you!' })}</h3>
                                <p>{intl.formatMessage({ id: 'contact.contactForm.success.message', defaultMessage: 'We have received your message and will get back to you soon.' })}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        {intl.formatMessage({ id: 'contact.contactForm.fullName' })}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder={intl.formatMessage({ id: 'contact.contactForm.fullName' })}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            {intl.formatMessage({ id: 'contact.contactForm.email' })}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder={intl.formatMessage({ id: 'contact.contactForm.email' })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">
                                            {intl.formatMessage({ id: 'contact.contactForm.phoneNumber' })}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder={intl.formatMessage({ id: 'contact.contactForm.phoneNumber' })}
                                        />
                                    </div>
                                </div>
                                {/* ...existing code... */}
                                <div className="form-group">
                                    <label htmlFor="subject">
                                        {intl.formatMessage({ id: 'contact.contactForm.subject' })}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder={intl.formatMessage({ id: 'contact.contactForm.subject' })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">
                                        {intl.formatMessage({ id: 'contact.contactForm.message' })}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder={intl.formatMessage({ id: 'contact.contactForm.message' })}
                                    />
                                </div>
                                <button type="submit" className="submit-button">
                                    {intl.formatMessage({ id: 'contact.contactForm.submit' })}
                                </button>
                            </form>
                        )}
                    </div>
                    {/* Contact Information */}
                    <div className="contact-info-wrapper">
                        <h2>{intl.formatMessage({ id: 'contact.contactDetails.title' })}</h2>
                        <div className="contact-info-items">
                            <div className="contact-info-item">
                                <div className="info-icon">📍</div>
                                <div className="info-content">
                                    <h3>{intl.formatMessage({ id: 'contact.contactDetails.address' })}</h3>
                                    <a href="https://maps.app.goo.gl/Cg9rA1FfZGkf4XSK7" target="_blank" rel="noopener noreferrer">Str. Victoriei, nr. 40, Seini, Maramureș, România</a>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon">📞</div>
                                <div className="info-content">
                                    <h3>{intl.formatMessage({ id: 'contact.contactDetails.phone' })}</h3>
                                    <a href="tel:+40773330210">+40773330210</a>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon">📧</div>
                                <div className="info-content">
                                    <h3>{intl.formatMessage({ id: 'contact.contactDetails.email' })}</h3>
                                    <a href="mailto:contact@sudurasimontaj.com">contact@sudurasimontaj.com</a>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon">💬</div>
                                <div className="info-content">
                                    <h3>{intl.formatMessage({ id: 'contact.contactDetails.whatsapp' })}</h3>
                                    <a href="https://wa.me/+40773330210" target="_blank" rel="noopener noreferrer">WhatsApp: +40773330210</a>
                                </div>
                            </div>
                        </div>
                        {/* Hours */}
                        <div className="contact-hours">
                            <h3>{intl.formatMessage({ id: 'contact.workingHours' })}</h3>
                            <div style={{ whiteSpace: 'pre-line', color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {intl.formatMessage({ id: 'contact.workingHoursDetails' })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Map Section */}
            <section className="contact-map">
                <h2>{intl.formatMessage({ id: 'contact.map' })}</h2>
                <div className="map-container">
                    <iframe
                        title="Sudura si Montaj Location"
                        src="https://www.google.com/maps?q=Sudura+si+Montaj+Str.+Victoriei,+nr.+40,+Seini,+Maramureș,+România&output=embed"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>
        </div>
    );
};

// Example usage:
// import en from '../locales/en.json';
// import ro from '../locales/ro.json';
// const locale = 'en';
// const messages = flattenMessages(locale === 'en' ? en : ro);
// <IntlProvider locale={locale} messages={messages}><ContactContent intl={useIntl()} /></IntlProvider>

export default ContactContent;

// export default Contact; // Removed duplicate export
