
import React from "react";
import ContactUs from "../components/Contact/ContactUs";
import { Button } from "react-bootstrap";

const Contact = () => {
  return (
    <div style={{ marginTop: "120px" }}>
      <ContactUs />
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        {/* <Button variant="primary" onClick={onEnrollClick}>
          Enroll Now
        </Button> */}
      </div>
    </div>
  );
};

export default Contact;
