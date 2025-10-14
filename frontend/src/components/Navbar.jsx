import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import "../assets/css/Navbar.css"
import UkFlag from '../assets/images/flags/UkFlag';
import RomanianFlag from '../assets/images/flags/RomanianFlag';

function Navabar({ switchLocale, locale }) {
    const intl = useIntl();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
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
        { to: "/services", id: "nav.services" },
        { to: "/contact", id: "nav.contact" },
    ];

        const renderNavLinks = () => (
        navLinks.map(link => (
            <li key={link.to}>
                <NavLink to={link.to}>
                    {intl.formatMessage({ id: link.id })}
                </NavLink>
            </li>
        ))
    );


    return (
        <>

        <div className="container">
            <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src="/logo.png" alt="Company Logo" className="logo-img" />
            </Link>
            <ul className="nav-links">
                {renderNavLinks()}
            </ul>
                    <div className="language-dropdown" ref={dropdownRef}>
                        <button className="language-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                            {languageConfig[locale].flag}
                            <span className="locale-text">{locale.toUpperCase()}</span>
                            <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {Object.keys(languageConfig).map((lang) => (
                                    <a key={lang} href="#" onClick={() => { switchLocale(lang); setDropdownOpen(false); }}>
                                        {languageConfig[lang].flag}
                                        <span>{languageConfig[lang].name}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
            </nav>
        </div>
        </>
    )
}

export default Navabar;
