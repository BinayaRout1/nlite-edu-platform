import React from "react";
import "./profileStory.css";
import profileImg from "../../assets/d.png";
import arrowFlow from "../../assets/a.png";
import plusFlow from "../../assets/p.png";
import ringBg from "../../assets/i5.png";

const ProfileStory = () => (
  <div className="story-main-container">
    <div className="image-side">
      {/* Big faded ring background */}
      <img src={ringBg} className="story-bg-ring" alt="Blue Ring" />
      {/* Profile image, centered over ring */}
      <img src={profileImg} className="story-profile-img" alt="Profile" />
      {/* Arrow flow image */}
      <img src={arrowFlow} className="story-arrow-img" alt="Arrow" />
      {/* Plus flow icon */}
      <img src={plusFlow} className="story-plus-img" alt="Plus Icon" />
    </div>
    <div className="story-content">
      <span className="story-label">OUR STORY</span>
      <h2 className="story-title">
        Innovating new ways to train  students
      </h2>
      <p className="story-p">
        We see no limits to what we can achieve by leveraging our
        individual and collective strengths. We reimagine the world with our
        ideas, insights, and unique perspectives.
      </p>
      <p className="story-p">
        Our innovation is led by data, curiosity, and the continuous need to
        evolve. We create an uplifting environment where we learn from our
        failures and celebrate our successes.
      </p>
    </div>
  </div>
);

export default ProfileStory;
