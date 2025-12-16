
import React from "react";
import "./RecognizedBy.css";
import Emblem from "../../assets/Emblem.jpg";
import dot from "../../assets/dot.png"; 
const RecognizedBy = () => {
  return (
    <section className="recognized-section position-relative py-5">
      <div className="container text-center">
        {/* Title */}
        <h2 className="recognized-title">
          Recognized <span>by</span>
        </h2>

        {/* Content Row */}
        <div className="d-flex justify-content-center align-items-center flex-wrap mt-5">
          {/* Emblem Image */}
          <img
            src={Emblem}
            alt="Government of India Emblem"
            className="gov-logo me-4"
          />

          {/* Right Side Text */}
          <div className="text-start d-flex flex-wrap align-items-start justify-content-start mca-wrapper">
            {/* Left Block */}
            <div className="mca-left me-5">
              <h5 className="mca-text fw-bold mb-1">
                {/* Blue boxes before MCA letters */}
                <span className="mca-box">M</span>MINISTRY OF <br />
                <span className="mca-box">C</span>CORPORATE <br />
                <span className="mca-box">A</span>AFFAIRS
              </h5>
              <p className="mca-sub mb-0">GOVERNMENT OF INDIA</p>
            </div>

            {/* Right Block */}
            <div className="mca-right">
              <p className="mca-desc mb-1">
                EMPOWERING BUSINESS, PROTECTING INVESTORS
              </p>
              <p className="mca-roles mb-0">
                <span className="text-orange">REGULATOR</span> •{" "}
                <span className="text-green">INTEGRATOR</span> •{" "}
                <span className="text-red">FACILITATOR</span> •{" "}
                <span className="text-blue">EDUCATOR</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Dots image at bottom-right */}
      <img src={dot} alt="Decorative Dots" className="dots-image" />
    </section>
  );
};

export default RecognizedBy;
