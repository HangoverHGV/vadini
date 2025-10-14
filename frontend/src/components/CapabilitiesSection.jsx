import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import "../assets/css/CapabilitiesSection.css"



const capabilities = [
  {
    id: 1,
    titleId: 'capabilities.demolition.title',
    descriptionId: 'capabilities.demolition.description',
    imgSrc: '../assets/images/container.png'
  },
  {
    id: 2,
    titleId: 'capabilities.trailers.title',
    descriptionId: 'capabilities.trailers.description',
    imgSrc: '../assets/images/trailer.png'
  },
  {
    id: 3,
    titleId: 'capabilities.hoists.title',
    descriptionId: 'capabilities.hoists.description',
    imgSrc: '../assets/images/hoist.png'
  },
  {
    id: 4,
    titleId: 'capabilities.repair.title',
    descriptionId: 'capabilities.repair.description',
    imgSrc: '../assets/images/repair.png'
  },
];

export default function CapabilitiesSection() {

    const intl = useIntl();
    const [activeCapability, setActiveCapability] = useState(capabilities[0]);

  const handleCapabilityClick = (capability) => {
    setActiveCapability(capability);
  };

  return (
    <section className="capabilities-section">
      <div className="content-container">

        {/* Left Side: Image */}
        <div className="image-column">
          <img
            src="path/to/your/container-image.jpg" // Replace with the path to your image
            alt="Large industrial container on a construction site"
            className="capability-image"
          />
        </div>

        {/* Right Side: Text and List */}
        <div className="text-column">
          <h2 className="section-title">
            Core
            <br />
            Capabilities
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
