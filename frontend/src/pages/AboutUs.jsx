import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import '../assets/css/AboutUs.css';


export default function AboutUs() {
  const intl = useIntl();
  const [activeIndex, setActiveIndex] = useState(null);

  // Get all message IDs
  const allIds = Object.keys(intl.messages);

  // Filter to those that match "about.list.<index>.(title|description)"
  const listIds = allIds.filter(id => id.startsWith('about.list.'));

  // Group them by index
  const listItems = [];
  const grouped = {};

  listIds.forEach(id => {
    const match = id.match(/about\.list\.(\d+)\.(title|description)/);
    if (match) {
      const index = match[1];
      const type = match[2];
      grouped[index] = grouped[index] || {};
      grouped[index][type] = intl.formatMessage({ id });
    }
  });

  const sorted = Object.keys(grouped)
    .sort((a, b) => a - b)
    .map(i => grouped[i]);

  const handleItemClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="about-us-section">
      <div className="about-us-content-container">
        <div className="about-us-column">
          <h2 className="about-us-title">
            {intl.formatMessage({ id: 'nav.about' })}
          </h2>
          <p className="about-us-intro">
            {intl.formatMessage({ id: 'about.description' })}
          </p>

          <div className="about-services-list">
            {sorted.map((item, index) => (
              <div key={index} className={`about-item ${activeIndex === index ? 'active' : ''}`} onClick={() => handleItemClick(index)}>
                <span className="about-item-number">0{index + 1}</span>
                <span className="about-item-title">{item.title}</span>
                {activeIndex === index && (<p className="about-item-description">{item.description}</p>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
