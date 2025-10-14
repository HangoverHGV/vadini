import { Outlet } from 'react-router-dom';
import Navabar from './Navbar';


export default function Layout({ switchLocale }) {
    return (
        <>
            <div>
                <Navabar switchLocale={switchLocale} />
                <Outlet />
            </div>
        </>
    );
}