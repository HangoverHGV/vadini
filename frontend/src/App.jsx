import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import enMessages from './locales/en.json';
import roMessages from './locales/ro.json';

import Layout from './components/Layout'
import Home from './pages/Home'
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';

// Define messages outside the component to prevent re-creation on every render
const messages = {
  'en': enMessages,
  'ro': roMessages,
};

// Function to determine the best initial locale
const getInitialLocale = () => {
  const savedLocale = localStorage.getItem('language');
  if (savedLocale && messages[savedLocale]) {
    return savedLocale;
  }
  const browserLang = navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'
  if (messages[browserLang]) {
    return browserLang;
  }
  return 'ro'; // Default fallback
};

function App() {
  const [locale, setLocale] = useState(getInitialLocale);

  // Save locale to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', locale);
  }, [locale]);

  const switchLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
    <BrowserRouter>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Routes >
          <Route element={<Layout switchLocale={switchLocale} locale={locale} />}>
              <Route path='/products' element={<Products />} />
            <Route path='/' element={<Home />} />
              <Route path='/about' element={<AboutUs />} />

          </Route>
        </Routes>
      </IntlProvider>
    </BrowserRouter>
  )
}

export default App
