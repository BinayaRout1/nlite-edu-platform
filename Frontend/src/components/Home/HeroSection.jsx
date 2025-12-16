import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HeroSection.css";


import heroImage from "../../assets/bg 1.svg";

const HeroSection = ({onEnrollClick}) => {
  return (
    <section className="hero-section">
      <Container fluid className="px-5">
        <Row className="align-items-center">
          {/* Left Content */}
          <Col md={6} className="hero-text ps-0">
            <h1>
              Empower Your Professional Journey With Industry-
              <span className="highlight">Ready Skills</span>
            </h1>
            <ul className="hero-list">
              <li>✔ Build Real-world projects with in-person collaboration.</li>
              <li>✔ Individual tailored learning approach</li>
              <li>✔ Mentored by industry experts</li>
              <li>✔ Get intensive placement assistance</li>
            </ul>
            
            <Button variant="primary" className="enroll-btn" onClick={onEnrollClick}>
                Enroll Now
            </Button>

          </Col>

          {/* Right Image */}
          
<Col
  md={6}
  className="d-flex justify-content-end align-items-center hero-image-col"
>
  <img
    src={heroImage}
    alt="Team Collaboration"
    className="hero-image img-fluid "
  />
</Col>




        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;


