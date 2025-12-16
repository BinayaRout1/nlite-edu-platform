import React from "react";
import { Button, Card } from "react-bootstrap";

const CourseCard = ({ title, desc, img, active }) => {
  return (
    <Card
      className="text-center course-card shadow-sm"
      style={{
        width: "304px",
        height: "431px",
        border: "none",
        borderRadius: "20px",
        backgroundColor: "#0B2A6D",
        color: "white",
        margin: "20px",
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between align-items-center">
        <div className="my-3">
          <img
            src={img}
            alt={title}
            style={{ height: "90px", objectFit: "contain" }}
          />
        </div>

        <div>
          <Card.Title style={{ fontWeight: "bold", fontSize: "20px" }}>
            {title}
          </Card.Title>
          <Card.Text
            style={{
              fontSize: "14px",
              color: "#ffffffcc",
              margin: "15px 0 30px 0",
              minHeight: "60px",
              padding: "0 10px",
            }}
          >
            {desc}
          </Card.Text>
        </div>

        <div>
          <Button
            style={{
              width: "207.04px",
              height: "40.46px",
              background: "#0087FF",
              borderRadius: "31px",
              border: "none",
              marginBottom: "12px",
            }}
          >
            Enroll Now
          </Button>
          <br />
          <Button
            style={{
              width: "207.04px",
              height: "40.46px",
              background: "#0087FF",
              borderRadius: "31px",
              border: "none",
            }}
          >
            Download Curriculum
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
