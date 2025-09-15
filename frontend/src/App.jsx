import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Navbar, Nav, Container, Button, Spinner } from "react-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import PageErrorBoundary from "./components/PageErrorBoundary";
import ErrorBoundaryProvider from "./components/ErrorBoundaryProvider";
import LazyWrapper from "./components/LazyWrapper";
import ThemeToggle from "./components/ThemeToggle";
import { Home, About, Projects, Resume, Contact } from "./pages";
import { AppProviders } from "./contexts";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Reduced loading time
    setTimeout(() => setIsLoading(false), prefersReducedMotion ? 500 : 1000);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [prefersReducedMotion]);

  const pages = {
    home: (
      <PageErrorBoundary pageName="Home">
        <LazyWrapper type="skeleton" count={1}>
          <Home />
        </LazyWrapper>
      </PageErrorBoundary>
    ),
    about: (
      <PageErrorBoundary pageName="About">
        <LazyWrapper type="skeleton" count={2}>
          <About />
        </LazyWrapper>
      </PageErrorBoundary>
    ),
    projects: (
      <PageErrorBoundary pageName="Projects">
        <LazyWrapper type="card" count={6}>
          <Projects />
        </LazyWrapper>
      </PageErrorBoundary>
    ),
    resume: (
      <PageErrorBoundary pageName="Resume">
        <LazyWrapper type="skeleton" count={1}>
          <Resume />
        </LazyWrapper>
      </PageErrorBoundary>
    ),
    contact: (
      <PageErrorBoundary pageName="Contact">
        <LazyWrapper type="skeleton" count={1}>
          <Contact />
        </LazyWrapper>
      </PageErrorBoundary>
    ),
  };

  // Snappier animations with reduced motion support
  const pageVariants = {
    initial: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : 100,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.3,
        ease: "easeOut",
      },
    },
    out: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -100,
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.2,
        ease: "easeIn",
      },
    },
  };

  const loadingVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.9,
      transition: { duration: prefersReducedMotion ? 0.2 : 0.4 },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-vh-100 d-flex align-items-center justify-content-center bg-dark"
        variants={loadingVariants}
        initial="initial"
        exit="exit"
      >
        <div className="text-center">
          <motion.div
            className="mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: prefersReducedMotion ? 0.5 : 1,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Spinner
              animation="border"
              variant="success"
              style={{ width: "4rem", height: "4rem" }}
            />
          </motion.div>
          <motion.h1
            className="gradient-text display-4 fw-bold mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Sourav Mondal
          </motion.h1>
          <motion.p
            className="text-muted fs-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Loading portfolio...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <AppProviders>
      <ErrorBoundary>
        <div className="min-vh-100 bg-dark text-light">
      {/* Bootstrap Navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.4 }}
      >
        <Navbar
          bg="dark"
          variant="dark"
          expand="lg"
          fixed="top"
          className="py-3"
        >
          <Container>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            >
              <Navbar.Brand
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage("home");
                }}
                className="fw-bold fs-3"
              >
                SM
              </Navbar.Brand>
            </motion.div>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {["home", "about", "projects", "resume", "contact"].map(
                  (page) => (
                    <motion.div
                      key={page}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Nav.Link
                        href={`#${page}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        className={`me-2 ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </Nav.Link>
                    </motion.div>
                  )
                )}
              </Nav>

                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="d-flex align-items-center gap-2"
                  >
                    <ThemeToggle variant="icon" size="sm" />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setCurrentPage("contact")}
                    >
                      Hire Me
                    </Button>
                  </motion.div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>

      {/* Page Navigation Dots */}
      <motion.div
        className="position-fixed end-0 top-50 translate-middle-y d-none d-lg-block"
        style={{ right: "2rem", zIndex: 40 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="d-flex flex-column gap-3">
          {["home", "about", "projects", "resume", "contact"].map(
            (page, index) => (
              <motion.button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn btn-sm rounded-circle p-0 ${
                  currentPage === page ? "btn-success" : "btn-outline-secondary"
                }`}
                style={{ width: "12px", height: "12px" }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                title={page.charAt(0).toUpperCase() + page.slice(1)}
              />
            )
          )}
        </div>
      </motion.div>

      {/* Page Content */}
      <div style={{ paddingTop: "80px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="position-fixed bottom-0 end-0 m-4"
        style={{ zIndex: 50 }}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <motion.div
          whileHover={
            prefersReducedMotion
              ? {}
              : {
                  scale: 1.05,
                  rotate: 360,
                }
          }
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "56px", height: "56px" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <i className="bi bi-arrow-up"></i>
          </Button>
        </motion.div>
      </motion.div>

      {/* Reduced Background Elements for Performance */}
      {!prefersReducedMotion && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: -10, overflow: "hidden" }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="position-absolute opacity-25 bg-gradient rounded-circle"
              style={{
                width: Math.random() * 200 + 100,
                height: Math.random() * 200 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "linear-gradient(135deg, #22c55e, #3b82f6)",
                filter: "blur(40px)",
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, Math.random() * 0.3 + 0.7, 1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
            borderRadius: "12px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
            </div>
          </ErrorBoundary>
        </AppProviders>
      );
    }

export default App;
