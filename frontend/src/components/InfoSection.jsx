import React from 'react';
import '../assets/css/InfoSection.css';

const InfoSection = ({ title, description, colorScheme = 'white' }) => {
  const containerClass = `info-section-container container-${colorScheme}`;

  return (
    <div className={containerClass}>
      <div className="container">
        <div className="info-section-content">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;