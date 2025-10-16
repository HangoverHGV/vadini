import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import "../assets/css/CapabilitiesSection.css"
import capabilitiesData from '../data/capabilities.json';

const capabilities = capabilitiesData;

export default function CapabilitiesSection() {

    const intl = useIntl();
    const [activeCapability, setActiveCapability] = useState(capabilities[0]);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const loadImage = async () => {
            let imageModule;
            try {
                // Try loading .png first
                imageModule = await import(`../assets/images/${activeCapability.imageKey}.png`);
            } catch (error) {
                // If .png fails, try loading .jpg
                imageModule = await import(`../assets/images/${activeCapability.imageKey}.jpg`);
            }

            if (isMounted) {
                setImageSrc(imageModule.default);
            }
        };

        loadImage();
        return () => { isMounted = false; };
    }, [activeCapability]);

  const handleCapabilityClick = (capability) => {
    setActiveCapability(capability);
  };

  return (
    <section className="capabilities-section">
      <div className="content-container">

        {/* Left Side: Image */}
        <div className="image-column">
          <img
            src={imageSrc}
            alt={intl.formatMessage({ id: activeCapability.titleId })}
            className="capability-image"
          />
        </div>

        {/* Right Side: Text and List */}
        <div className="text-column">
          <h2 className="section-title">
            {intl.formatMessage({ id: "capabilities.title1" })}
            <br />
            {intl.formatMessage({ id: "capabilities.title2" })}
          </h2>

          <div className="capabilities-list">
            {capabilities.map((item) => (
              <div
                key={item.id}
                className={`capability-item ${activeCapability.id === item.id ? 'active' : ''}`}
                onClick={() => handleCapabilityClick(item)}
              >
                <span className="item-number">0{item.id}</span>
                <span className="item-title">{intl.formatMessage({ id: item.titleId })}</span>

                {/* Description only shows for the active item */}
                {activeCapability.id === item.id && (
                  <p className="item-description">{intl.formatMessage({ id: item.descriptionId })}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
