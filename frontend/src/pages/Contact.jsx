import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/contact", formData);
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: "bi bi-envelope",
      title: "Email",
      value: "sourav.mondal@email.com",
      link: "mailto:sourav.mondal@email.com",
    },
    {
      icon: "bi bi-linkedin",
      title: "LinkedIn",
      value: "linkedin.com/in/souravmondal",
      link: "https://linkedin.com/in/souravmondal",
    },
    {
      icon: "bi bi-github",
      title: "GitHub",
      value: "github.com/souravmondal",
      link: "https://github.com/souravmondal",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0.05 : 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.2 },
    },
  };

  return (
    <div className="min-vh-100 bg-dark py-5">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-5">
            <motion.h1
              className="gradient-text display-4 fw-bold mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
            >
              Get In Touch
            </motion.h1>
            <motion.p
              className="lead text-muted mx-auto"
              style={{ maxWidth: "600px" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : 0.2,
                delay: 0.1,
              }}
            >
              Have a project in mind or want to discuss opportunities? I'd love
              to hear from you!
            </motion.p>
          </motion.div>

          <Row className="g-5">
            {/* Contact Form */}
            <Col lg={8}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      Send Message
                    </Card.Title>

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-light fw-medium">
                              Name *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your name"
                              isInvalid={!!errors.name}
                              className="border-0"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-light fw-medium">
                              Email *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your.email@example.com"
                              isInvalid={!!errors.email}
                              className="border-0"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label className="text-light fw-medium">
                          Subject *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          isInvalid={!!errors.subject}
                          className="border-0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.subject}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="text-light fw-medium">
                          Message *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell me about your project or inquiry..."
                          isInvalid={!!errors.message}
                          className="border-0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <motion.div
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={loading}
                          className="w-100 d-flex align-items-center justify-content-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send"></i>
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </Form>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Contact Information */}
            <Col lg={4}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0 h-100">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      Contact Info
                    </Card.Title>

                    <div className="d-flex flex-column gap-4">
                      {contactInfo.map((info, index) => (
                        <motion.div
                          key={info.title}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="d-flex align-items-center gap-3"
                        >
                          <motion.div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: "48px",
                              height: "48px",
                              background:
                                "linear-gradient(135deg, #22c55e, #3b82f6)",
                            }}
                            whileHover={
                              prefersReducedMotion
                                ? {}
                                : { scale: 1.1, rotate: 5 }
                            }
                          >
                            <i className={`${info.icon} text-white fs-5`}></i>
                          </motion.div>

                          <div className="flex-grow-1">
                            <h6 className="text-light fw-medium mb-1">
                              {info.title}
                            </h6>
                            <a
                              href={info.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted text-decoration-none"
                            >
                              {info.value}
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      className="mt-5 p-4 rounded"
                      style={{ background: "rgba(34, 197, 94, 0.1)" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h6 className="text-success fw-bold mb-2">
                        <i className="bi bi-clock me-2"></i>
                        Response Time
                      </h6>
                      <p className="text-muted mb-0 small">
                        I typically respond within 24 hours during business
                        days.
                      </p>
                    </motion.div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default Contact;
