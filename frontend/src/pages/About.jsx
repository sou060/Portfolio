import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Badge,
  Button,
} from "react-bootstrap";

const About = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const skills = [
    { name: "Spring Boot", level: 95, category: "Backend" },
    { name: "Java", level: 90, category: "Backend" },
    { name: "Microservices", level: 88, category: "Architecture" },
    { name: "Docker", level: 85, category: "DevOps" },
    { name: "MySQL", level: 82, category: "Database" },
    { name: "React", level: 80, category: "Frontend" },
    { name: "Kubernetes", level: 75, category: "DevOps" },
    { name: "AWS", level: 70, category: "Cloud" },
  ];

  const experiences = [
    {
      title: "Senior Spring Boot Developer",
      company: "TechCorp Solutions",
      period: "2022 - Present",
      description:
        "Leading microservices development and mentoring junior developers.",
      technologies: ["Spring Boot", "Docker", "Kubernetes", "AWS"],
    },
    {
      title: "Full Stack Developer",
      company: "InnovateTech",
      period: "2020 - 2022",
      description:
        "Developed scalable web applications using Spring Boot and React.",
      technologies: ["Spring Boot", "React", "MySQL", "Redis"],
    },
    {
      title: "Java Developer",
      company: "StartUp Inc",
      period: "2018 - 2020",
      description: "Built RESTful APIs and database-driven applications.",
      technologies: ["Java", "Spring", "PostgreSQL", "Maven"],
    },
  ];

  const education = [
    {
      degree: "Master of Computer Science",
      institution: "University of Technology",
      period: "2016 - 2018",
      description:
        "Specialized in Software Engineering and Distributed Systems",
    },
    {
      degree: "Bachelor of Computer Science",
      institution: "Engineering College",
      period: "2012 - 2016",
      description: "Focused on Programming Fundamentals and Data Structures",
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
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
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-5">
            <motion.h1
              className="gradient-text display-4 fw-bold mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
            >
              About Me
            </motion.h1>
            <motion.p
              className="lead text-muted mx-auto"
              style={{ maxWidth: "700px" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : 0.2,
                delay: 0.1,
              }}
            >
              Passionate Spring Boot developer with 5+ years of experience
              building scalable microservices and robust backend systems. I love
              solving complex problems and creating efficient, maintainable
              code.
            </motion.p>
          </motion.div>

          <Row className="g-5">
            {/* About Me Section */}
            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0 h-100">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      <i className="bi bi-person-circle me-2"></i>
                      Who I Am
                    </Card.Title>

                    <div className="text-muted">
                      <p className="mb-3">
                        I'm a dedicated software engineer with a deep passion
                        for backend development and system architecture. My
                        journey in technology started with curiosity and has
                        evolved into a career focused on building reliable,
                        scalable applications.
                      </p>

                      <p className="mb-3">
                        When I'm not coding, you'll find me exploring new
                        technologies, contributing to open-source projects, or
                        sharing knowledge with the developer community. I
                        believe in continuous learning and staying updated with
                        industry best practices.
                      </p>

                      <p className="mb-0">
                        My approach combines technical expertise with a strong
                        focus on clean code, performance optimization, and user
                        experience. I enjoy collaborating with cross-functional
                        teams to deliver high-quality solutions.
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Skills Section */}
            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0 h-100">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      <i className="bi bi-gear-wide-connected me-2"></i>
                      Technical Skills
                    </Card.Title>

                    <div className="mb-4">
                      {[
                        "Backend",
                        "Frontend",
                        "DevOps",
                        "Database",
                        "Cloud",
                        "Architecture",
                      ].map((category) => (
                        <div key={category} className="mb-3">
                          <h6 className="text-light fw-medium mb-2">
                            {category}
                          </h6>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {skills
                              .filter((skill) => skill.category === category)
                              .map((skill) => (
                                <Badge
                                  key={skill.name}
                                  bg="secondary"
                                  className="fw-medium"
                                >
                                  {skill.name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h6 className="text-light fw-medium mb-3">
                        Proficiency Levels
                      </h6>
                      {skills.slice(0, 5).map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-3"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted fw-medium">
                              {skill.name}
                            </span>
                            <Badge bg="success" className="fw-bold">
                              {skill.level}%
                            </Badge>
                          </div>
                          <ProgressBar
                            now={skill.level}
                            variant="success"
                            className="mb-0"
                            style={{ height: "8px" }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Experience Section */}
          <motion.div variants={itemVariants} className="mt-5">
            <h2 className="gradient-text h3 fw-bold text-center mb-5">
              <i className="bi bi-briefcase me-2"></i>
              Professional Experience
            </h2>

            <Row className="g-4">
              {experiences.map((exp, index) => (
                <Col key={index} lg={4} md={6}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={prefersReducedMotion ? {} : { y: -5 }}
                  >
                    <Card className="glass-effect border-0 h-100">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <Card.Title className="h6 fw-bold text-light mb-1">
                              {exp.title}
                            </Card.Title>
                            <p className="text-success fw-medium mb-1">
                              {exp.company}
                            </p>
                            <small className="text-muted">{exp.period}</small>
                          </div>
                          <Badge bg="primary" className="fw-medium">
                            {exp.period.split(" ")[0]}
                          </Badge>
                        </div>

                        <Card.Text className="text-muted mb-3">
                          {exp.description}
                        </Card.Text>

                        <div className="d-flex flex-wrap gap-1">
                          {exp.technologies.map((tech, i) => (
                            <Badge key={i} bg="secondary" className="fw-medium">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Education Section */}
          <motion.div variants={itemVariants} className="mt-5">
            <h2 className="gradient-text h3 fw-bold text-center mb-5">
              <i className="bi bi-mortarboard me-2"></i>
              Education
            </h2>

            <Row className="g-4">
              {education.map((edu, index) => (
                <Col key={index} md={6}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={prefersReducedMotion ? {} : { y: -5 }}
                  >
                    <Card className="glass-effect border-0 h-100">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <Card.Title className="h6 fw-bold text-light mb-1">
                              {edu.degree}
                            </Card.Title>
                            <p className="text-success fw-medium mb-1">
                              {edu.institution}
                            </p>
                            <small className="text-muted">{edu.period}</small>
                          </div>
                          <i className="bi bi-award text-success fs-4"></i>
                        </div>

                        <Card.Text className="text-muted mb-0">
                          {edu.description}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-5">
            <Card className="glass-effect border-0">
              <Card.Body className="p-5">
                <h3 className="gradient-text h4 fw-bold mb-3">
                  Ready to Work Together?
                </h3>
                <p className="text-muted mb-4">
                  Let's discuss your project and see how I can help bring your
                  ideas to life.
                </p>
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="d-flex align-items-center gap-2 mx-auto"
                  >
                    <i className="bi bi-envelope"></i>
                    Get In Touch
                  </Button>
                </motion.div>
              </Card.Body>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default About;
