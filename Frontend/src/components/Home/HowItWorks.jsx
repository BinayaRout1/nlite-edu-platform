

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HowItWorks.css";
import { FaArrowRight } from "react-icons/fa";

// Import images
import jobSeeker from "../../assets/jobSeeker.jpg";
import employed from "../../assets/employed.jpg";
import Ellipse from "../../assets/Ellipse.png"; 

const steps = [
  { id: "01", title: "Hands on Technical Training", icon: "fa-solid fa-laptop-code" },
  { id: "02", title: "Periodic Assessments", icon: "fa-regular fa-clipboard" },
  { id: "03", title: "Real world project implementations", icon: "fa-solid fa-diagram-project" },
  { id: "04", title: "Professionals Soft skills Training", icon: "fa-solid fa-chalkboard-user" },
  { id: "05", title: "Job relevant assessment and interview support", icon: "fa-regular fa-comments" },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section position-relative py-5">
      
      {/* ✅ Ellipse image top-right */}
      <img src={Ellipse} alt="Ellipse decoration" className="ellipse-image" />

      <Container fluid className="position-relative"> 
        <div className="section-title-overlap text-center">
          <h2>How It Works</h2>
        </div>

        {/* ✅ Wider blue box */}
        <div className="how-it-works-box mx-auto p-6 position-relative">
          
          {/* Dots Pattern */}
          <div className="dots-pattern">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i}></div>
            ))}
          </div>

          <Row className="align-items-center text-center">
            {/* Job Seeker */}
            <Col xs={12} md={2} className="mb-4 mb-md-0">
              <div className="info-card">
                <img src={jobSeeker} alt="Job Seeker" />
                <h6>Job Seeker</h6>
              </div>
            </Col>

            {/* Steps */}
            <Col xs={12} md={8}>
              <div className="steps-container d-flex flex-wrap justify-content-center align-items-center">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="step-item text-center">
                      <div className="step-box">
                        <div className="icon-square mx-auto mb-2">
                          <i className={step.icon}></i>
                        </div>
                        <h5 className="step-number">{step.id}</h5>
                        <p className="step-title">{step.title}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <FaArrowRight className="step-arrow" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </Col>

            {/* Employed */}
            <Col xs={12} md={2} className="mt-4 mt-md-0">
              <div className="info-card">
                <img src={employed} alt="Employed" />
                <h6>Employed</h6>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
