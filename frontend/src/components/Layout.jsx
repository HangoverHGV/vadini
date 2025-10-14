import { Outlet } from 'react-router-dom';
import Navabar from './Navbar';
import ContactFooter from './ContactFooter';


export default function Layout({ switchLocale, locale }) {
    return (
        <>
            <div>
                <Navabar switchLocale={switchLocale} locale={locale} />
                <Outlet />
                <ContactFooter />
            </div>
        </>
    );
}