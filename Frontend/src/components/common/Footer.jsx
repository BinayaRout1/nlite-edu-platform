import React from "react";
import "./footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Footer = () => (
  <footer className="footer-main">
    <div className="footer-content">
      <div className="footer-header-row">
        <span className="footer-title">
          NLITE <span className="footer-title-bold">Technologies LLP</span>
        </span>
        <div className="footer-social">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedinIn /></a>
          <a href="#"><FaYoutube /></a>
        </div>
      </div>
      <div className="footer-cols-row">
        {/* Popular Courses */}
        <div>
          <div className="footer-col-title">Popular <span>Course</span></div>
          <div className="footer-link">JAVA &amp; REACT</div>
          <div className="footer-link">.Net and react</div>
          <div className="footer-link">Java and Angular</div>
          <div className="footer-link">Python</div>
          <div className="footer-link">DEVOPS</div>
        </div>
        {/* Quick Links */}
        <div>
          <div className="footer-col-title">Quick <span>Links</span></div>
          <div className="footer-link">FAQ's</div>
          <div className="footer-link">Terms &amp; Conditions</div>
          <div className="footer-link">Privacy Policy</div>
          <div className="footer-link">Refunds Policy</div>
        </div>
        {/* Our Location */}
       <div className="footer-location-block">
  <div className="footer-col-title">
    Our <span>Location</span>
  </div>
  <div className="footer-location-row">
    <FaMapMarkerAlt className="footer-location-icon" />
    <div>
      1st Floor, Plot no 434,<br />
      Nandankanan Rd, Raghunathpur,<br />
      Bhubaneswar, Odisha 751024
    </div>
  </div>
</div>
        {/* Contact Us */}
        <div>
          <div className="footer-col-title">Contact <span>Us</span></div>
          <div><FaEnvelope style={{marginRight: "9px", color:'#3ec0f5'}} />contact@nlite.in</div>
          <div><FaPhoneAlt style={{marginRight: "9px", color:'#3ec0f5'}} />+91 8428448903</div>
          <div style={{marginLeft:"28px"}}>+91 9475484959</div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
