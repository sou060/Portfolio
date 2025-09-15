import { lazy } from 'react';

// Lazy load all page components for better performance
export const Home = lazy(() => import('./Home'));
export const About = lazy(() => import('./About'));
export const Projects = lazy(() => import('./Projects'));
export const Resume = lazy(() => import('./Resume'));
export const Contact = lazy(() => import('./Contact'));
export const Admin = lazy(() => import('./Admin'));
