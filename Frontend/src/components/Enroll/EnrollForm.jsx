import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "./EnrollForm.css";
import API from "../../api";

const EnrollForm = ({ show, handleClose }) => {
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    status: "",
    datetime: "",
    course: "",
  });
  const [errors, setErrors] = useState({});

  //Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load courses",
          text: "Please check your connection or try again later.",
          timer: 3000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });
      }
    };
    fetchCourses();
  }, []);

  // ✅ Animation toggle
  useEffect(() => {
    if (show) setAnimate(true);
    else {
      const timeout = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Only letters and spaces are allowed in name";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter 10-digit phone number";

    if (!formData.email.trim()) newErrors.email = "Email Id is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter valid email";

    if (!formData.status) newErrors.status = "Please select your status";
    if (!formData.datetime) newErrors.datetime = "Please select a date";
    if (!formData.course) newErrors.course = "Please select a course";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData({ ...formData, fullName: filteredValue });
    } else if (name === "phone") {
      const filteredValue = value.replace(/\D/g, "");
      setFormData({ ...formData, phone: filteredValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  // Toast function
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
      showClass: { popup: "swal2-noanimation" },
      hideClass: { popup: "" },
    });
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const formattedDate = formatDate(formData.datetime);

        const response = await API.post("/enrollments", {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          status: formData.status,
          course: formData.course,
          datetime: formattedDate,
        });

        if (response.status === 201 || response.status === 200) {
          showToast("success", "✅ Enrollment submitted successfully!");
          setFormData({
            fullName: "",
            phone: "",
            email: "",
            status: "",
            datetime: "",
            course: "",
          });
          handleClose();
        }
      } catch (error) {
        console.error("❌ Error submitting enrollment:", error);
        showToast("error", "❌ Failed to submit enrollment. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      showToast("warning", "⚠️ Please correct the highlighted errors!");
    }
  };

  return (
    <div className={`enroll-form-overlay ${show ? "show" : ""}`}>
      {animate && (
        <div
          className={`enroll-form-container ${show ? "slide-in" : "slide-out"}`}
        >
          <h3 className="enroll-title">Enroll Now</h3>

          <Form noValidate onSubmit={handleSubmit}>
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Id"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Dynamic Course Dropdown */}
            <Form.Group className="mb-3">
              <Form.Select
                name="course"
                value={formData.course}
                onChange={handleChange}
                isInvalid={!!errors.course}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.course}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Status */}
            <Form.Group className="mb-3">
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                isInvalid={!!errors.status}
              >
                <option value="">Current Status</option>
                <option value="Working Professional">
                  Working Professional
                </option>
                <option value="Looking for Job">Looking for Job</option>
                <option value="Studying">Studying</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.status}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Preferred Date */}
            <Form.Group className="mb-4">
              <Form.Select
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                isInvalid={!!errors.datetime}
              >
                <option value="">Preferred date</option>
                <option value="01/02/2026">01/02/2026</option>
                <option value="11/02/2026">11/02/2026</option>
                <option value="21/02/2026">21/02/2026</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.datetime}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                className="close-btn"
                type="button"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="submit-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default EnrollForm;
