
import React from "react";
import HeroSection from "../components/Home/HeroSection";
import HeroSlider from "../components/Home/HeroSlider";
import HowItWorks from "../components/Home/HowItWorks";
import RecognizedBy from "../components/Home/RecognizedBy";

const Home = ({ onEnrollClick }) => {
  return (
    <>
      
      <HeroSection onEnrollClick={onEnrollClick} />
      <HeroSlider onEnrollClick={onEnrollClick} />
      <HowItWorks />
      <RecognizedBy />
    </>
  );
};

export default Home;
