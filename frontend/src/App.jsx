import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import enMessages from './locales/en.json';
import roMessages from './locales/ro.json';

import Layout from './components/Layout'
import Home from './pages/Home'

function App() {

  const [locale, setLocale] = useState(localStorage.getItem('language') || 'en');
  const messages = {
    'en': enMessages,
    'ro': roMessages,
  };

  // Save locale to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', locale);
  }, [locale]);

  const switchLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
    <>
      <BrowserRouter>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Routes >
            <Route element={<Layout switchLocale={switchLocale} locale={locale} />}>
              <Route path='/' element={<Home />} />
            </Route>
          </Routes>
        </IntlProvider>
      </BrowserRouter>
    </>
  )
}

export default App
