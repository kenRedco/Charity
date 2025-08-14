import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Donate from './pages/Donate';
import About from './pages/About';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy'; // <-- ADD THIS
import TermsOfService from './pages/TermsOfService'; // <-- ADD THIS
import './index.css';

import 'aos/dist/aos.css';
import AOS from 'aos';

AOS.init({
  duration: 800,
  once: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="donate" element={<Donate />} />
          <Route path="about" element={<About />} />
          <Route path="impact" element={<Impact />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} /> {/* <-- ADD THIS */}
          <Route path="terms" element={<TermsOfService />} /> {/* <-- ADD THIS */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);