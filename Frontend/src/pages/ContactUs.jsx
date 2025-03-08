import React, { useState } from "react";
import "../styles/contact.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.message.trim()) errors.message = "Message cannot be empty";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      setFormData({ name: "", email: "", subject: "Inquiry", message: "" });
    }
  };

  return (
    <>
      <div className="contactP">
        <h1>Contact Us</h1>
        <p>Have any question? Feel free to reach out</p>
        <form className="contactForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
          <select name="subject" value={formData.name} onChange={handleChange}>
            <option value="Inquiry">Inquiry</option>
            <option value="Feedback">Feedback</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <span className="error">{errors.message}</span>}
          <button type="submit">Send Message</button>
        </form>
      </div>
    </>
  );
}

export default ContactUs;
