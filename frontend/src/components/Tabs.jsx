import React, { useState, useEffect } from "react";
import "../assets/css/Tabs.css";

const Tabs = ({ items }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    console.log(items);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {items.map((item, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {items.map((item, index) => (
          <div
            key={index}
            className={`tab-panel ${index === activeTab ? "active" : ""}`}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
