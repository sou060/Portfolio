import { useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation, useInView, Variants } from 'framer-motion';

// Predefined animation variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (
  threshold: number = 0.1,
  triggerOnce: boolean = true
) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold, 
    once: triggerOnce 
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  return { ref, controls, isInView };
};

// Custom hook for hover animations
export const useHoverAnimation = () => {
  const controls = useAnimation();

  const handleHover = useCallback(() => {
    controls.start({
      scale: 1.05,
      transition: { duration: 0.2, ease: 'easeOut' },
    });
  }, [controls]);

  const handleHoverEnd = useCallback(() => {
    controls.start({
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    });
  }, [controls]);

  return { controls, handleHover, handleHoverEnd };
};

// Custom hook for click animations
export const useClickAnimation = () => {
  const controls = useAnimation();

  const handleClick = useCallback(() => {
    controls.start({
      scale: 0.95,
      transition: { duration: 0.1 },
    });
    controls.start({
      scale: 1,
      transition: { duration: 0.1, delay: 0.1 },
    });
  }, [controls]);

  return { controls, handleClick };
};

// Custom hook for loading animations
export const useLoadingAnimation = () => {
  const controls = useAnimation();

  const startLoading = useCallback(() => {
    controls.start({
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    });
  }, [controls]);

  const stopLoading = useCallback(() => {
    controls.stop();
    controls.start({
      rotate: 0,
      transition: { duration: 0.3 },
    });
  }, [controls]);

  return { controls, startLoading, stopLoading };
};

// Custom hook for typing animation
export const useTypingAnimation = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  const reset = useCallback(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, []);

  return { displayedText, isComplete: currentIndex === text.length, reset };
};

// Custom hook for counter animation
export const useCounterAnimation = (
  target: number,
  duration: number = 2000,
  startOnMount: boolean = true
) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = count;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (target - startValue) * easeOut);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, count, isAnimating]);

  useEffect(() => {
    if (startOnMount) {
      animate();
    }
  }, [startOnMount, animate]);

  return { count, animate, isAnimating };
};

// Custom hook for parallax effect
export const useParallax = (offset: number = 50) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const y = scrollY * offset;

  return { y };
};

// Custom hook for reduced motion support
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Custom hook for animation presets
export const useAnimationPresets = () => {
  const reducedMotion = useReducedMotion();

  const getPreset = useCallback((preset: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp') => {
    if (reducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.1 } },
      };
    }

    switch (preset) {
      case 'fadeInUp': return fadeInUp;
      case 'fadeInDown': return fadeInDown;
      case 'fadeInLeft': return fadeInLeft;
      case 'fadeInRight': return fadeInRight;
      case 'scaleIn': return scaleIn;
      case 'slideInUp': return slideInUp;
      default: return fadeInUp;
    }
  }, [reducedMotion]);

  return { getPreset, reducedMotion };
};

export default {
  useScrollAnimation,
  useHoverAnimation,
  useClickAnimation,
  useLoadingAnimation,
  useTypingAnimation,
  useCounterAnimation,
  useParallax,
  useReducedMotion,
  useAnimationPresets,
};
