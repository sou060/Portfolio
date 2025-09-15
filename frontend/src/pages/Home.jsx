import React, { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
  Badge,
} from "react-bootstrap";

const Home = memo(() => {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Memoized floating elements for better performance
  const floatingElements = useMemo(() => 
    Array.from(
      { length: prefersReducedMotion ? 0 : 4 },
      (_, i) => ({
        id: i,
        size: Math.random() * 60 + 30,
        duration: 4,
        delay: Math.random() * 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    ),
    [prefersReducedMotion]
  );

  const skills = useMemo(() => [
    { name: "Spring Boot", level: 95, color: "success" },
    { name: "Java", level: 90, color: "primary" },
    { name: "Microservices", level: 88, color: "info" },
    { name: "Docker", level: 85, color: "warning" },
    { name: "MySQL", level: 82, color: "danger" },
  ], []);

  const socialLinks = useMemo(() => [
    {
      name: "GitHub",
      icon: "bi bi-github",
      href: "https://github.com/souravmondal",
      color: "dark",
    },
    {
      name: "LinkedIn",
      icon: "bi bi-linkedin",
      href: "https://linkedin.com/in/souravmondal",
      color: "primary",
    },
    {
      name: "Email",
      icon: "bi bi-envelope",
      href: "mailto:sourav.mondal@email.com",
      color: "success",
    },
  ], []);

  // Snappier animation durations
  const fast = useMemo(() => 
    ({ duration: prefersReducedMotion ? 0.1 : 0.2, ease: "easeOut" }),
    [prefersReducedMotion]
  );

  // Memoized handlers
  const handleDownloadResume = useCallback(() => {
    // Download resume logic
    window.open('/api/resume/download', '_blank');
  }, []);

  const handleContactClick = useCallback(() => {
    // Navigate to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-vh-100 position-relative overflow-hidden">
      {/* Optimized Floating Background Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="position-absolute opacity-25 bg-gradient rounded-circle"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
            background: "linear-gradient(135deg, #22c55e, #3b82f6)",
            filter: "blur(20px)",
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <Container className="py-5">
        <Row className="min-vh-100 align-items-center">
          {/* Left Column */}
          <Col lg={6} className="mb-5 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={fast}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.1 }}
                className="mb-4"
              >
                <motion.h1
                  className="gradient-text display-3 fw-bold mb-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  Sourav Mondal
                </motion.h1>

                <motion.div
                  className="position-relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  <h2 className="h3 text-muted fw-medium mb-0">
                    Spring Boot Developer
                  </h2>
                  <motion.div
                    className="position-absolute bottom-0 start-0 h-1 bg-gradient rounded"
                    style={{
                      bottom: "-0.5rem",
                      background: "linear-gradient(135deg, #22c55e, #3b82f6)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  />
                </motion.div>
              </motion.div>

              <motion.p
                className="lead text-muted mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.4 }}
              >
                Crafting scalable microservices with Java & Spring Boot.
                Passionate about building reliable backend systems that power
                modern applications.
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="d-flex flex-column flex-sm-row gap-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.5 }}
              >
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="d-flex align-items-center gap-2"
                    onClick={handleDownloadResume}
                  >
                    <i className="bi bi-download"></i>
                    Download Resume
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="d-flex align-items-center gap-2"
                    onClick={handleContactClick}
                  >
                    <i className="bi bi-envelope"></i>
                    Get In Touch
                  </Button>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="d-flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.6 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-outline-${social.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: "48px", height: "48px" }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    title={social.name}
                  >
                    <i className={social.icon}></i>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </Col>

          {/* Right Column - Skills */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="glass-effect border-0">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      Technical Skills
                    </Card.Title>
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="mb-3"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted fw-medium">
                              {skill.name}
                            </span>
                            <Badge bg={skill.color} className="fw-bold">
                              {skill.level}%
                            </Badge>
                          </div>
                          <ProgressBar
                            now={skill.level}
                            variant={skill.color}
                            className="mb-0"
                            style={{ height: "8px" }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
      >
        <motion.div
          className="d-flex flex-column align-items-center"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          style={{ cursor: "pointer" }}
        >
          <div
            className="border border-muted rounded-pill d-flex justify-content-center p-2 mb-2"
            style={{ width: "24px", height: "40px" }}
          >
            <motion.div
              className="bg-success rounded-pill"
              style={{ width: "4px", height: "12px" }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <small className="text-muted">Scroll</small>
        </motion.div>
      </motion.div>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
