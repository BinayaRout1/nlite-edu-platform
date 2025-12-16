import React from "react";
import "./aboutus.css";
import ww from "../../assets/ww.png";
import gp from "../../assets/gp.png";
import hr from "../../assets/hr.png";
import i5 from "../../assets/i5.png";
import dot1 from "../../assets/dot1.png";
import dot2 from "../../assets/dot2.png";
 
const AboutUs = () => (
  <section className="about-main">
    <div className="about-left">
      <div className="about-title">ABOUT US</div>
      <h1 className="about-heading">
        Learning Made<br />
        Simple for<br />
        Everyone
      </h1>
      <p className="about-para">
        Transforming tech education for the<br />
        next generation of students & employees.
      </p>
    </div>
    <div className="about-images">
      {/* Blue Circle */}
      <img src={i5} className="about-circle" alt="blue circle" />
      {/* Top two images */}
      <div className="about-row-top">
        <img src={ww} alt="img-1" className="about-img img-top" />
        <img src={gp} alt="img-2" className="about-img img-top" />
      </div>
      {/* Big bottom image */}
      <img src={hr} alt="img-3" className="about-img img-bottom" />
    </div>
    <div className="dots">
  <img src={dot1} alt="dots1" className="about-dots-floating dot1" />
  <img src={dot2} alt="dots2" className="about-dots-floating dot2" />
</div>
  </section>
);

export default AboutUs;
