import React, { useState } from "react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "./ContactUs.css";
import Mail from "../../assets/Mail.png";
import call from "../../assets/call.png";
import Contactus from "../../assets/Contactus.png";
import API from "../../api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    issue: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ SweetAlert2 Toast Function
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

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ✅ Validate form before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Only letters and spaces are allowed in name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.issue.trim()) {
      newErrors.issue = "Please select a message type";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("warning", "⚠️ Please correct the highlighted errors!");
      return;
    }

    try {
      await API.post("/contacts", formData);

      showToast("success", "✅ Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", issue: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("❌ Error sending message:", error);
      showToast("error", "❌ Failed to send message. Try again later.");
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-form-section position-relative">
        <img src={Contactus} alt="contact-banner" className="dots-img" />

        <div className="container">
          <div className="contact-header text-center">
            <h2>Contact Our Team</h2>
          </div>

          <div className="form-container p-5 rounded shadow-sm bg-white mt-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label">Your Name*</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Contact Email*</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="form-label">Phone Number*</label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    inputMode="numeric"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                {/* Issue */}
                <div className="col-md-6">
                  <label className="form-label">Message Related to*</label>
                  <select
                    className={`form-select ${
                      errors.issue ? "is-invalid" : ""
                    }`}
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select message type</option>
                    <option>General Query</option>
                    <option>Course Info</option>
                    <option>Support</option>
                  </select>
                  {errors.issue && (
                    <div className="invalid-feedback">{errors.issue}</div>
                  )}
                </div>

                {/* Message */}
                <div className="col-12">
                  <label className="form-label">Your Message*</label>
                  <textarea
                    className={`form-control ${
                      errors.message ? "is-invalid" : ""
                    }`}
                    name="message"
                    rows="5"
                    placeholder="Write your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback">{errors.message}</div>
                  )}
                </div>

                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary px-5 mt-3">
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
