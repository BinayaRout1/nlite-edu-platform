import React from "react";
import './navbar.css';
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import logo from "../../assets/logo.png";

const CustomNavbar = ({ onEnrollClick }) => (
  <Navbar
    bg="white"
    expand="lg"
    fixed="top"
    className="border-bottom border-4 border-primary custom-navbar"
  >
    <Container>
      <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
        <img src={logo} alt="NLITE Logo" height="90" width="190" className="me-3" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="ms-auto align-items-center">
          <NavLink to="/" end className="nav-link custom-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link custom-link">
            About
          </NavLink>
          <NavLink to="/courses" className="nav-link custom-link">
            Courses
          </NavLink>
          <NavLink to="/blog" className="nav-link custom-link">
            Blogs
          </NavLink>
          <NavLink to="/contact" className="nav-link custom-link">
            Contact US
          </NavLink>
          <Button 
            onClick={onEnrollClick}
            className="custom-enroll-btn"
          >
            Enroll Now
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default CustomNavbar;
