import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import "../assets/css/Navbar.css"
import UkFlag from '../assets/images/flags/UkFlag';
import RomanianFlag from '../assets/images/flags/RomanianFlag';

function Navbar({ switchLocale, locale }) {
    const intl = useIntl();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);    const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const languageConfig = {
        en: { name: 'English', flag: <UkFlag /> },
        ro: { name: 'Romanian', flag: <RomanianFlag /> },
    };

    const navLinks = [
        { to: "/", id: "nav.home" },
        { to: "/products", id: "nav.products" },
        { to: "#contact", id: "nav.contact" },
        { to: "/about", id: "nav.about" },
    ];

    const renderNavLinks = () => (
        navLinks.map(link => (
            <li key={link.to}>
                {link.to.startsWith('#') ? (
                    <a href={link.to} onClick={() => setMobileMenuOpen(false)}>
                        {intl.formatMessage({ id: link.id })}
                    </a>
                ) : (
                    <NavLink to={link.to} onClick={() => setMobileMenuOpen(false)} end>
                        {intl.formatMessage({ id: link.id })}
                    </NavLink>
                )}
            </li>
        ))
    );

    const renderLanguageDropdown = (isMobile = false) => (
        <div className={`language-dropdown ${isMobile ? 'mobile-language-dropdown' : 'desktop-language-dropdown'}`} ref={!isMobile ? dropdownRef : null}>
            <button className="language-button" onClick={() => isMobile ? setMobileDropdownOpen(!isMobileDropdownOpen) : setDropdownOpen(!isDropdownOpen)}>
                {languageConfig[locale].flag}
                <span className="locale-text">{locale.toUpperCase()}</span>
                <span className="dropdown-arrow">{(isMobile ? isMobileDropdownOpen : isDropdownOpen) ? '▲' : '▼'}</span>
            </button>
            {(isMobile ? isMobileDropdownOpen : isDropdownOpen) && (
                <div className="dropdown-menu">
                    {Object.keys(languageConfig).map((lang) => (
                        <a key={lang} href="#" onClick={(e) => { e.preventDefault(); switchLocale(lang); setDropdownOpen(false); setMobileMenuOpen(false); setMobileDropdownOpen(false); }}>
                            {languageConfig[lang].flag}
                            <span>{languageConfig[lang].name}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="container">
            <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src="/logo.png" alt="Company Logo" className="logo-img" />
            </Link>
            <ul className="nav-links">
                {renderNavLinks()}
            </ul>
            <button
                className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={intl.formatMessage({ id: 'nav.toggleMenu' })}
            >
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </button>
            <div className="navbar-right-section">
                {/* Language dropdown for desktop */}
                {renderLanguageDropdown()}
            </div>
            {isMobileMenuOpen && (
                <div className="mobile-nav-overlay">
                    <ul className="mobile-nav-links">
                        {renderNavLinks()}
                    </ul>
                    {/* Language dropdown for mobile */}
                    {renderLanguageDropdown(true)}
                </div>
            )}
            </nav>
        </div>
    )
}

export default Navbar;
