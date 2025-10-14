import { Link, NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import "../assets/css/Navbar.css"

function Navabar({switchLocale}) {
    const intl = useIntl();


    const navLinks = [
        { to: "/services", id: "nav.services" },
        { to: "/contact", id: "nav.contact" },
    ];

        const renderNavLinks = () => (
        navLinks.map(link => (
            <li key={link.to}>
                <NavLink to={link.to} onClick={() => setMobileMenuOpen(false)}>
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
                    <div>
                        <button onClick={() => {
                            console.log("English clicked")
                            switchLocale('en');

                        }}>English</button>
                        <button onClick={() => {
                            console.log("Romanian clicked")
                            switchLocale('ro');
                        }}>Romanian</button>
                    </div>
            </nav>
        </div>
        </>
    )
}

export default Navabar;
