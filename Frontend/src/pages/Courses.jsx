


import React from "react";
import CoursesList from "../components/Courses/CoursesList";
import { Button } from "react-bootstrap";

const Courses = ({ onEnrollClick }) => {
  return (
    <div style={{ marginTop: "120px" }}>
      
      <CoursesList onEnrollClick={onEnrollClick} />
    </div>
  );
};

export default Courses;

