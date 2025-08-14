import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/ScrollToTop'; // <-- 1. IMPORT THE NEW COMPONENT
import './index.css';

import 'aos/dist/aos.css';  
import AOS from 'aos';

// --- Lazy Load all page components for performance ---
const Home = React.lazy(() => import('./pages/Home'));
const Donate = React.lazy(() => import('./pages/Donate'));
const About = React.lazy(() => import('./pages/About'));
const Impact = React.lazy(() => import('./pages/Impact'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));

AOS.init({
  duration: 800,
  once: true,
});

const LoadingFallback = () => (
  <div className="w-full h-screen flex justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router basename="/Charity">
      <ScrollToTop /> {/* <-- 2. ADD THE COMPONENT HERE */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="donate" element={<Donate />} />
            <Route path="about" element={<About />} />
            <Route path="impact" element={<Impact />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  </React.StrictMode>
);