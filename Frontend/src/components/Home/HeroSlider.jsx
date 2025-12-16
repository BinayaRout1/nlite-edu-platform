import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "./HeroSlider.css";

import nliteLogo from "../../assets/nliteLogo.png";
import dot from "../../assets/dot.png";
import javareact from "../../assets/javareact.png";
import dotnetReact from "../../assets/dotnetReact.png";
import javaandangular from "../../assets/javaandangular.png";

const HeroSlider = ({ onEnrollClick }) => {
  const slides = [
    {
      img: javareact,
      title: "Full Stack Web Development",
      highlight: "Java and React",
      comingSoon: false,
    },
    {
      img: dotnetReact,
      title: "Full Stack Web Development",
      highlight: ".Net and React",
      comingSoon: true,
    },
    {
      img: javaandangular,
      title: "Full Stack Web Development",
      highlight: "Java and Angular",
      comingSoon: true,
    },
  ];

  return (
    <section className="hero-slider">
      <div className="hero-wrapper">
        <Row className="align-items-center m-0">
          {/* Left Text Section */}
          <Col md={6} className="text-section">
            <div className="text-content">
              <h1>
                Learn with effective <br />
                <span>classroom-based training</span>
                <br />
                <span className="highlight">for real-world success</span>
              </h1>
            </div>
            <img src={dot} alt="dots" className="dot-pattern" />
          </Col>

          
          <Col md={6} className="slider-section">
            <Swiper
              modules={[Pagination, Mousewheel, FreeMode]}
              pagination={{ clickable: true }}
              freeMode={true}              
              mousewheel={{
                forceToAxis: true,         
                sensitivity: 1,            
                releaseOnEdges: true,      
              }}
              simulateTouch={true}
              grabCursor={true}
              allowTouchMove={true}
              slidesPerView={1}
              spaceBetween={30}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="slide-card">
                    <img src={nliteLogo} alt="nlite" className="slide-logo" />
                    <h4>{slide.title}</h4>
                    <h4 className="highlight-text">{slide.highlight}</h4>

                    <Button className="enroll-btn" onClick={onEnrollClick}>
                      Enroll Now
                    </Button>

                    <img
                      src={slide.img}
                      alt="slide visual"
                      className="slide-img"
                    />

                    {slide.comingSoon && (
                      <div className="overlay">
                        <span className="overlay-text">Coming Soon</span>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HeroSlider;