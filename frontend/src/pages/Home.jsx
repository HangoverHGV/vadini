
import { useIntl } from 'react-intl';
import HeroSection from '../components/HeroSection';
import CapabilitiesSection from '../components/CapabilitiesSection';

export default function Home(){
    const intl = useIntl();

    return <>
        {/* --- Standard SEO Meta Tags (React 19) --- */}
        <title>Sudura si Montaj Profesional - Acasa | SuduraSimontaj.com</title>
        <meta 
            name="description" 
            content="Oferim servicii profesionale de sudura si montaj. Calitate garantata si preturi competitive pentru proiectele dumneavoastra." 
        />
        <link rel="canonical" href="https://www.sudurasimontaj.com/" />

        {/* --- Open Graph / Facebook / LinkedIn Meta Tags --- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sudurasimontaj.com/" />
        <meta property="og:title" content="Sudura si Montaj Profesional - Acasa" />
        <meta property="og:description" content="Servicii profesionale de sudura si montaj cu calitate garantata." />
        <meta property="og:image" content="https://www.sudurasimontaj.com/path/to/your/social-image.jpg" />

        {/* --- Structured Data (JSON-LD for Local Business) --- */}
        {/* This helps Google understand your business details for Rich Results. */}
        {/* !!! IMPORTANT: You MUST fill in your actual business details below. !!! */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Sudura si Montaj",
            "image": "https://www.sudurasimontaj.com/path/to/your/logo.png",
            "@id": "https://www.sudurasimontaj.com/",
            "url": "https://www.sudurasimontaj.com/",
            "telephone": "+40-773-330-210",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Strada Victoriei Nr. 40",
              "addressLocality": "Seini",
              "postalCode": "435400",
              "addressCountry": "RO"
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "08:00",
              "closes": "16:30"
            } 
          })}
        </script>

        <div className='container-black'>
            <div className='container'>
                <HeroSection/>
            </div>
        </div>
        <div className='container-white'>
            <div className='container'>
                <CapabilitiesSection/>
            </div>
        </div>
    </>
}
