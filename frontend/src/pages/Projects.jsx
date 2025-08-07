import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import api from "../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0.05 : 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.2,
        ease: "easeOut",
      },
    },
  };

  const techBadgeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: prefersReducedMotion ? 0.1 : 0.15,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="text-center">
          <Spinner
            animation="border"
            variant="success"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-muted mt-3">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Alert variant="danger" className="text-center">
                <Alert.Heading>Error loading projects</Alert.Heading>
                <p>{error}</p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark py-5">
      <Container>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
          className="text-center mb-5"
        >
          <motion.h1
            className="gradient-text display-4 fw-bold mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.2,
              delay: 0.1,
            }}
          >
            My Projects
          </motion.h1>
          <motion.p
            className="lead text-muted mx-auto"
            style={{ maxWidth: "600px" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.2,
              delay: 0.2,
            }}
          >
            Here are some of the projects I've worked on, showcasing my
            expertise in Spring Boot, microservices, and full-stack development.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row className="g-4">
            {projects.map((project) => (
              <Col key={project.id} lg={4} md={6}>
                <motion.div
                  variants={cardVariants}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: -5,
                          scale: 1.01,
                        }
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-100 glass-effect border-0">
                    <div
                      className="position-relative overflow-hidden"
                      style={{
                        height: "200px",
                        backgroundImage: `url(${project.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: "#333",
                      }}
                    >
                      <motion.div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ background: "rgba(0,0,0,0.3)" }}
                        whileHover={
                          prefersReducedMotion
                            ? {}
                            : {
                                background: "rgba(0,0,0,0.1)",
                              }
                        }
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5 fw-bold text-light mb-3">
                        {project.title}
                      </Card.Title>

                      <Card.Text className="text-muted flex-grow-1 mb-3">
                        {project.description}
                      </Card.Text>

                      <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2">
                          {(project.techStack || "")
                            .split(",")
                            .map((tech, i) => (
                              <motion.div
                                key={i}
                                variants={techBadgeVariants}
                                custom={i}
                              >
                                <Badge bg="secondary" className="fw-medium">
                                  {tech.trim()}
                                </Badge>
                              </motion.div>
                            ))}
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-auto">
                        {project.githubLink && (
                          <motion.div
                            whileHover={prefersReducedMotion ? {} : { x: 3 }}
                          >
                            <Button
                              variant="outline-primary"
                              size="sm"
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-flex align-items-center gap-1"
                            >
                              <i className="bi bi-github"></i>
                              GitHub
                            </Button>
                          </motion.div>
                        )}

                        {project.liveLink && (
                          <motion.div
                            whileHover={prefersReducedMotion ? {} : { x: 3 }}
                          >
                            <Button
                              variant="primary"
                              size="sm"
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-flex align-items-center gap-1"
                            >
                              <i className="bi bi-box-arrow-up-right"></i>
                              Live Demo
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-5"
          >
            <div className="mb-4">
              <i className="bi bi-folder-x display-1 text-muted"></i>
            </div>
            <h3 className="text-light mb-3">No Projects Found</h3>
            <p className="text-muted">
              Projects will appear here once they're added to the database.
            </p>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default Projects;
