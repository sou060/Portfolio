import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  ProgressBar,
} from "react-bootstrap";

const Resume = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const skills = {
    "Backend Development": [
      { name: "Spring Boot", level: 95 },
      { name: "Java 17+", level: 90 },
      { name: "Spring Security", level: 88 },
      { name: "REST APIs", level: 92 },
      { name: "GraphQL", level: 75 },
    ],
    "Database & ORM": [
      { name: "MySQL", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "JPA/Hibernate", level: 88 },
      { name: "Redis", level: 75 },
      { name: "MongoDB", level: 70 },
    ],
    "DevOps & Cloud": [
      { name: "Docker", level: 85 },
      { name: "Kubernetes", level: 75 },
      { name: "AWS", level: 80 },
      { name: "CI/CD", level: 82 },
      { name: "Jenkins", level: 78 },
    ],
    "Frontend & Tools": [
      { name: "React.js", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "Git", level: 90 },
      { name: "Maven", level: 85 },
      { name: "IntelliJ IDEA", level: 88 },
    ],
  };

  const experience = [
    {
      title: "Senior Spring Boot Developer",
      company: "TechCorp Solutions",
      period: "2022 - Present",
      location: "Remote",
      achievements: [
        "Led development of microservices architecture serving 1M+ users",
        "Mentored 5 junior developers and established coding standards",
        "Reduced API response time by 40% through optimization",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
      technologies: [
        "Spring Boot",
        "Docker",
        "Kubernetes",
        "AWS",
        "MySQL",
        "Redis",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "InnovateTech",
      period: "2020 - 2022",
      location: "Hybrid",
      achievements: [
        "Developed 10+ RESTful APIs for e-commerce platform",
        "Built React frontend with 95% test coverage",
        "Integrated payment gateways and inventory management",
        "Collaborated with UX team to improve user experience",
      ],
      technologies: [
        "Spring Boot",
        "React",
        "MySQL",
        "Redis",
        "Stripe API",
        "JWT",
      ],
    },
    {
      title: "Java Developer",
      company: "StartUp Inc",
      period: "2018 - 2020",
      location: "On-site",
      achievements: [
        "Built database-driven applications using Spring Framework",
        "Implemented user authentication and authorization",
        "Created automated testing suite with 90% coverage",
        "Optimized database queries improving performance by 50%",
      ],
      technologies: [
        "Java",
        "Spring",
        "PostgreSQL",
        "Maven",
        "JUnit",
        "Mockito",
      ],
    },
  ];

  const education = [
    {
      degree: "Master of Computer Science",
      institution: "University of Technology",
      period: "2016 - 2018",
      gpa: "3.8/4.0",
      relevantCourses: [
        "Advanced Software Engineering",
        "Distributed Systems",
        "Database Management Systems",
        "Cloud Computing",
        "Machine Learning Fundamentals",
      ],
    },
    {
      degree: "Bachelor of Computer Science",
      institution: "Engineering College",
      period: "2012 - 2016",
      gpa: "3.7/4.0",
      relevantCourses: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming",
        "Computer Networks",
        "Operating Systems",
        "Software Engineering",
      ],
    },
  ];

  const certifications = [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-123456",
    },
    {
      name: "Spring Professional Certification",
      issuer: "VMware",
      date: "2022",
      credentialId: "SPRING-789012",
    },
    {
      name: "Docker Certified Associate",
      issuer: "Docker Inc",
      date: "2021",
      credentialId: "DCA-345678",
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
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-5">
          <motion.h1 
              className="gradient-text display-4 fw-bold mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
          >
            Resume
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
              My professional journey, skills, and achievements in software
              development.
            </motion.p>
          </motion.div>

          <Row className="g-5">
            {/* Skills Section */}
            <Col lg={4}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0 h-100">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      <i className="bi bi-gear-wide-connected me-2"></i>
                      Technical Skills
                    </Card.Title>

                    {Object.entries(skills).map(([category, skillList]) => (
                      <div key={category} className="mb-4">
                        <h6 className="text-light fw-medium mb-3">
                          {category}
                        </h6>
                        {skillList.map((skill, index) => (
        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
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
                              style={{ height: "6px" }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Experience Section */}
            <Col lg={8}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      <i className="bi bi-briefcase me-2"></i>
                      Professional Experience
                    </Card.Title>

                    <div className="position-relative">
                      {/* Timeline line */}
                      <div
                        className="position-absolute start-0 top-0 h-100"
                        style={{
                          width: "2px",
                          background:
                            "linear-gradient(135deg, #22c55e, #3b82f6)",
                          left: "1rem",
                        }}
                      />

                      {experience.map((exp, index) => (
                <motion.div 
                          key={index}
                          variants={cardVariants}
                          className="position-relative mb-4"
                          style={{ paddingLeft: "3rem" }}
                        >
                          {/* Timeline dot */}
                          <div
                            className="position-absolute start-0 top-0 rounded-circle"
                            style={{
                              width: "12px",
                              height: "12px",
                              background:
                                "linear-gradient(135deg, #22c55e, #3b82f6)",
                              left: "0.5rem",
                              top: "0.5rem",
                            }}
                          />

                          <Card
                            className="border-0 mb-3"
                            style={{ background: "rgba(30, 41, 59, 0.5)" }}
                  >
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="fw-bold text-light mb-1">
                                    {exp.title}
                                  </h6>
                                  <p className="text-success fw-medium mb-1">
                                    {exp.company}
                                  </p>
                                  <small className="text-muted">
                                    {exp.period} • {exp.location}
                                  </small>
                                </div>
                                <Badge bg="primary" className="fw-medium">
                                  {exp.period.split(" ")[0]}
                                </Badge>
                              </div>

                              <ul className="text-muted small mb-3">
                                {exp.achievements.map((achievement, i) => (
                                  <li key={i} className="mb-1">
                                    {achievement}
                                  </li>
                                ))}
                              </ul>

                              <div className="d-flex flex-wrap gap-1">
                                {exp.technologies.map((tech, i) => (
                                  <Badge
                        key={i}
                                    bg="secondary"
                                    className="fw-medium"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                    ))}
                    </div>
                  </Card.Body>
                </Card>
                </motion.div>
            </Col>
          </Row>

          {/* Education & Certifications */}
          <Row className="g-5 mt-4">
            {/* Education */}
            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0 h-100">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      <i className="bi bi-mortarboard me-2"></i>
                      Education
                    </Card.Title>

                    {education.map((edu, index) => (
                <motion.div 
                        key={index}
                        variants={cardVariants}
                        className="mb-4"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="fw-bold text-light mb-1">
                              {edu.degree}
                            </h6>
                            <p className="text-success fw-medium mb-1">
                              {edu.institution}
                            </p>
                            <small className="text-muted">{edu.period}</small>
                          </div>
                          <Badge bg="info" className="fw-medium">
                            GPA: {edu.gpa}
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <h6 className="text-light fw-medium mb-2">
                            Relevant Courses:
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            {edu.relevantCourses.map((course, i) => (
                              <Badge
                                key={i}
                                bg="secondary"
                                className="fw-medium"
                              >
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {index < education.length - 1 && (
                          <hr className="border-secondary" />
                        )}
                      </motion.div>
                    ))}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Certifications */}
            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <Card className="glass-effect border-0 h-100">
                  <Card.Body className="p-4">
                    <Card.Title className="h4 fw-bold text-light mb-4">
                      <i className="bi bi-award me-2"></i>
                      Certifications
                    </Card.Title>

                    {certifications.map((cert, index) => (
                <motion.div
                        key={index}
                        variants={cardVariants}
                        className="mb-4"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold text-light mb-1">
                              {cert.name}
                            </h6>
                            <p className="text-success fw-medium mb-1">
                              {cert.issuer}
                            </p>
                            <small className="text-muted">
                              ID: {cert.credentialId}
                            </small>
                          </div>
                          <Badge bg="warning" className="fw-medium">
                            {cert.date}
                          </Badge>
                        </div>

                        {index < certifications.length - 1 && (
                          <hr className="border-secondary" />
                        )}
                      </motion.div>
                    ))}

                    <motion.div
                      className="mt-4 p-3 rounded"
                      style={{ background: "rgba(34, 197, 94, 0.1)" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h6 className="text-success fw-bold mb-2">
                        <i className="bi bi-lightning me-2"></i>
                        Continuous Learning
                      </h6>
                      <p className="text-muted mb-0 small">
                        Actively pursuing new certifications and staying updated
                        with latest technologies.
                      </p>
                    </motion.div>
                  </Card.Body>
                </Card>
                </motion.div>
            </Col>
          </Row>

          {/* Download Resume */}
          <motion.div variants={itemVariants} className="text-center mt-5">
            <Card className="glass-effect border-0">
              <Card.Body className="p-5">
                <h3 className="gradient-text h4 fw-bold mb-3">
                  Download My Resume
                </h3>
                <p className="text-muted mb-4">
                  Get a detailed PDF version of my resume for your records.
                </p>
                <motion.div
                  className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  >
                  <Button
                    as="a"
                    href="/api/resume/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="lg"
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-download"></i>
                    Download PDF
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="d-flex align-items-center gap-2"
                      >
                    <i className="bi bi-printer"></i>
                    Print Resume
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

export default Resume;
