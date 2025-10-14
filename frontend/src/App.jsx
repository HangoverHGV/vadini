import { useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { IntlProvider } from 'react-intl';

import enMessages from './locales/en.json';
import roMessages from './locales/ro.json';

import Layout from './components/Layout'
import Home from './pages/Home'

function App() {

  const [locale, setLocale] = useState('en'); // Default locale
  const messages = {
    'en': enMessages,
    'ro': roMessages,
  };

  const switchLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
    <>
      <BrowserRouter>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <Routes >
            <Route element={<Layout switchLocale={switchLocale} />}>
              <Route path='/' element={<Home />} />
            </Route>
          </Routes>
        </IntlProvider>
      </BrowserRouter>
    </>
  )
}

export default App
