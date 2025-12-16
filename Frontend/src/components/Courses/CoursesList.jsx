import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Nav,
  Modal,
  Form,
} from "react-bootstrap";
import Swal from "sweetalert2";
import "./CoursesList.css";
import API from "../../api"; // ✅ central axios instance (uses /api automatically)

// ===== Validation functions =====
function validateName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}
function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}
function validateEmail(email) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

// ✅ Toast helper function
const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    icon,
    title,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#fff",
    color: "#333",
  });
};

// ===== Modal Component =====
const DownloadCurriculumModal = ({ show, onHide, course }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setForm((prev) => ({ ...prev, name: value.replace(/[^A-Za-z\s]/g, "") }));
      return;
    }
    if (name === "phone") {
      setForm((prev) => ({ ...prev, phone: value.replace(/\D/g, "") }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!validateName(form.name))
      newErrors.name = "Name must contain only letters.";
    if (!validatePhone(form.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!validateEmail(form.email)) newErrors.email = "Enter a valid email.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!course || !course.document) {
        showToast("warning", "⚠️ No curriculum document available!");
        return;
      }

      setLoading(true);
      try {
        // ✅ Correct Axios POST
        const response = await API.post("/curriculum", {
          name: form.name,
          phone: form.phone,
          email: form.email,
          course: course.name,
        });

        if (response.status !== 200 && response.status !== 201)
          throw new Error(response.data?.message || "Error saving data");

        // ✅ Correct file URL (use env if set)
        const fileUrl = import.meta.env.VITE_FILE_URL
          ? `${import.meta.env.VITE_FILE_URL}/courses/${course.document}`
          : `/uploads/courses/${course.document}`;

        window.open(fileUrl, "_blank", "noopener,noreferrer");
        showToast("success", "✅ Curriculum opened in new tab!");
      } catch (err) {
        console.error("❌ Error saving download info:", err);
        showToast("error", "❌ Error saving your details. Please try again.");
      } finally {
        setLoading(false);
        onHide();
        setForm({ name: "", phone: "", email: "" });
      }
    } else {
      showToast("warning", "⚠️ Please correct the highlighted errors!");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="download-modal-card"
    >
      <Modal.Body>
        <h2
          className="text-center mb-4"
          style={{ color: "#124077", fontWeight: 700 }}
        >
          Download Curriculum
        </h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              className="download-modal-input"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              autoComplete="off"
              maxLength={10}
              className="download-modal-input"
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email Id"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              className="download-modal-input"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="download-modal-btn"
            style={{
              width: 170,
              margin: "0 auto",
              display: "block",
              background: "#124077",
              fontWeight: 600,
              fontSize: 22,
              borderRadius: 10,
              marginTop: 24,
              boxShadow: "0 2px 12px rgba(18,64,119,0.09)",
            }}
          >
            {loading ? "Downloading..." : "Download"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// ===== Main Component =====
const CoursesList = ({ onEnrollClick }) => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showDownload, setShowDownload] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const activeCourses = courses.filter(
    (course) => course.active === 1 || course.active === true
  );

  const filteredCourses =
    filter === "All"
      ? activeCourses
      : activeCourses.filter((course) => course.status === filter);

  return (
    <div className="courses-section">
      <Container>
        <h2 className="text-center mb-4">
          <span className="text-dark">Courses</span>{" "}
          <span className="text-primary">List</span>
        </h2>

        {/* Tabs */}
        <Nav variant="tabs" className="mb-4 courses-tabs">
          {["All", "Open", "Coming Soon", "Closed"].map((tab) => (
            <Nav.Item key={tab}>
              <Nav.Link
                active={filter === tab}
                onClick={() => setFilter(tab)}
                className="courses-tab"
              >
                {tab}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Course Cards */}
        <Row className="justify-content-center">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Col
                key={course.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="d-flex justify-content-center mb-4"
              >
                <Card
                  className={`course-card text-center ${
                    course.status === "Open" ? "active" : "inactive"
                  }`}
                >
                  <div className="course-image">
                    {course.image ? (
                      <img
                        src={
                          import.meta.env.VITE_FILE_URL
                            ? `${import.meta.env.VITE_FILE_URL}/courses/${
                                course.image
                              }`
                            : `/uploads/courses/${course.image}`
                        }
                        alt={course.name}
                      />
                    ) : (
                      <div className="p-4 text-muted">No Image</div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{course.name}</Card.Title>
                    <Card.Text>{course.description}</Card.Text>
                    <div className="d-flex flex-column gap-2 mt-3">
                      <Button
                        variant="primary"
                        className="enroll-btn"
                        onClick={onEnrollClick}
                      >
                        Enroll Now
                      </Button>
                      <Button
                        variant="outline-primary"
                        className="download-btn"
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowDownload(true);
                        }}
                      >
                        Download Curriculum
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">
              No active courses available.
            </p>
          )}
        </Row>
      </Container>

      {/* Modal */}
      <DownloadCurriculumModal
        show={showDownload}
        onHide={() => setShowDownload(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default CoursesList;
