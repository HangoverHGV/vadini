import { Outlet } from "react-router-dom";
import Navabar from "./Navbar";
import ContactFooter from "./ContactFooter";

export default function Layout({ switchLocale, locale }) {
  return (
    <>
      <div className="app-shell">
        <Navabar switchLocale={switchLocale} locale={locale} />
        <main className="main-content">
          <Outlet />
        </main>
        <ContactFooter />
      </div>
    </>
  );
}
