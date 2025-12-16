import React from "react";
import "./missionvision.css";
import aim from "../../assets/aim.png";            
import circle from "../../assets/circle.png";      
import binacular from "../../assets/binacular.png";

const MissionVision = () => (
  <section className="mv-grid">
    <div className="mv-card">
      <div className="mv-icon-box">
        <img src={aim} alt="Mission AIM" className="mv-main-icon" />
      </div>
      <div className="mv-title">MISSION</div>
      <div className="mv-desc">
        Provide practice-based skill trainings using an unique teaching methodologies & skill platform to enhance right skills required in an industry for working professionals, Non-Tech professionals, College students & Start-ups through new skilling, up skilling & re-skilling.
      </div>
    </div>
    <div className="mv-card">
      <div className="mv-icon-box">
        <img src={circle} alt="Vision Circle" className="mv-vision-circle" />
        <img src={binacular} alt="Vision Binacular" className="mv-vision-center" />
      </div>
      <div className="mv-title">VISION</div>
      <div className="mv-desc">
        To transform into a right employee by imparting industry suited IT skills in a corporate office working environment with Holistic approach.
      </div>
    </div>
  </section>
);

export default MissionVision;
