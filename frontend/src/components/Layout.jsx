import { Outlet } from 'react-router-dom';
import Navabar from './Navbar';


export default function Layout({ switchLocale, locale }) {
    return (
        <>
            <div>
                <Navabar switchLocale={switchLocale} locale={locale} />
                <Outlet />
            </div>
        </>
    );
}