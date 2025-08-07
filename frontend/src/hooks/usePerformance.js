import { useState, useEffect } from "react";

export const usePerformance = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState("fast");

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    // Check for low power mode (Safari)
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        setIsLowPowerMode(battery.level < 0.2);
        battery.addEventListener("levelchange", () => {
          setIsLowPowerMode(battery.level < 0.2);
        });
      });
    }

    // Check connection speed
    if ("connection" in navigator) {
      const connection = navigator.connection;
      setConnectionSpeed(connection.effectiveType || "fast");

      connection.addEventListener("change", () => {
        setConnectionSpeed(connection.effectiveType || "fast");
      });
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Get optimized animation duration based on performance settings
  const getAnimationDuration = (baseDuration = 0.3) => {
    if (prefersReducedMotion) return 0.1;
    if (isLowPowerMode) return baseDuration * 0.5;
    if (connectionSpeed === "slow" || connectionSpeed === "2g")
      return baseDuration * 0.7;
    return baseDuration;
  };

  // Get optimized animation scale based on performance settings
  const getAnimationScale = (baseScale = 1.05) => {
    if (prefersReducedMotion) return 1;
    if (isLowPowerMode) return baseScale * 0.8;
    return baseScale;
  };

  // Check if animations should be disabled
  const shouldDisableAnimations = () => {
    return prefersReducedMotion || isLowPowerMode || connectionSpeed === "2g";
  };

  // Get optimized transition duration
  const getTransitionDuration = (baseDuration = 200) => {
    if (prefersReducedMotion) return 50;
    if (isLowPowerMode) return baseDuration * 0.5;
    if (connectionSpeed === "slow" || connectionSpeed === "2g")
      return baseDuration * 0.7;
    return baseDuration;
  };

  return {
    prefersReducedMotion,
    isLowPowerMode,
    connectionSpeed,
    getAnimationDuration,
    getAnimationScale,
    shouldDisableAnimations,
    getTransitionDuration,
  };
};
