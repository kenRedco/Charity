import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { EMAILJS, SOCIAL_LINKS } from './config';

const SOCIAL_ICONS = [
  { key: 'twitter',  Icon: FaTwitter,    label: 'Twitter'   },
  { key: 'facebook', Icon: FaFacebookF,  label: 'Facebook'  },
  { key: 'linkedin', Icon: FaLinkedinIn, label: 'LinkedIn'  },
  { key: 'instagram',Icon: FaInstagram,  label: 'Instagram' },
];

export default function App() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Esc
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterStatus('submitting');
    emailjs
      .send(
        EMAILJS.serviceId,
        EMAILJS.newsletterTemplateId,
        { newsletter_email: newsletterEmail },
        EMAILJS.publicKey
      )
      .then(() => {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      })
      .catch(() => setNewsletterStatus('error'));
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md transition-colors duration-200 ${
      isActive
        ? scrolled ? 'bg-coral/10 text-coral' : 'bg-white/15 text-white'
        : ''
    } ${
      scrolled
        ? 'text-ink dark:text-gray-200 hover:bg-forest/5 dark:hover:bg-white/10'
        : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="site-shell min-h-screen overflow-x-clip bg-paper dark:bg-gray-950 text-ink dark:text-gray-100 flex flex-col transition-colors duration-300">
      <svg className="site-atmosphere" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g className="site-network-illustration" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-40 192 130 90l172 94 160-129 148 116 156-91 168 115 151-79 166 100 172-93" />
          <path d="M-12 447 124 350l178 91 160-128 166 103 151-82 168 104 169-79 181 107 153-84" />
          <path d="m130 90-6 260m178-166v267m160-396v268m148-152v279m156-370v278m168-163v255m151-334v242m166-142v274" />
          <path d="M1020 658c45-52 97-76 154-72 41 2 76 21 104 54 28-33 63-52 104-54 57-4 109 20 154 72M1017 660c8 59 51 115 129 168l132 82 132-82c78-53 121-109 129-168" />
          <path d="M1117 646c-7-31 13-57 43-57 20 0 38 12 50 32 12-20 30-32 50-32 30 0 50 26 43 57-10 43-93 99-93 99s-83-56-93-99Z" />
          <path d="M1042 675c-30 6-54 21-70 45 39 40 86 65 144 77m352-122c30 6 54 21 70 45-39 40-86 65-144 77" />
          <circle cx="130" cy="90" r="5" />
          <circle cx="302" cy="184" r="5" />
          <circle cx="462" cy="55" r="5" />
          <circle cx="610" cy="171" r="5" />
          <circle cx="766" cy="80" r="5" />
          <circle cx="934" cy="195" r="5" />
          <circle cx="1085" cy="116" r="5" />
          <circle cx="1251" cy="216" r="5" />
        </g>
      </svg>
      {/* ── Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 py-3 flex justify-between items-center ${
          scrolled
            ? 'bg-paper/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-sm border-b border-forest/10 dark:border-white/10'
            : 'bg-gradient-to-b from-black/25 to-transparent'
        }`}
      >
        <Link
          to="/"
          className={`text-2xl font-bold transition-colors duration-300 ${
            scrolled ? 'text-forest dark:text-white' : 'text-white drop-shadow-md'
          }`}
        >
          CryptoCharity
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          <NavLink to="/"       className={navLinkClass}>Home</NavLink>
          <NavLink to="/about"  className={navLinkClass}>About</NavLink>
          <NavLink to="/impact" className={navLinkClass}>Impact</NavLink>
          <NavLink to="/contact"className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-full transition-colors ${
              scrolled
                ? 'text-forest dark:text-gray-300 hover:bg-forest/5 dark:hover:bg-white/10'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <Link
            to="/donate"
            className="font-semibold px-5 py-2.5 rounded-md bg-coral text-white shadow-sm hover:bg-coral/90 transition-colors"
          >
            Donate Now
          </Link>
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDarkMode(d => !d)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-full ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`text-3xl ${scrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[100] bg-forest/98 dark:bg-gray-950/98 backdrop-blur-xl transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-16">
            <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-white">
              CryptoCharity
            </Link>
            <button
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="text-4xl text-white"
            >
              <FiX />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-10" aria-label="Mobile navigation">
            <NavLink to="/"        onClick={closeMenu} className="text-3xl font-semibold text-white">Home</NavLink>
            <NavLink to="/about"   onClick={closeMenu} className="text-3xl font-semibold text-white">About</NavLink>
            <NavLink to="/impact"  onClick={closeMenu} className="text-3xl font-semibold text-white">Impact</NavLink>
            <NavLink to="/contact" onClick={closeMenu} className="text-3xl font-semibold text-white">Contact</NavLink>
            <Link
              to="/donate"
              onClick={closeMenu}
              className="mt-8 bg-coral text-white font-bold px-10 py-4 rounded-md text-xl"
            >
              Donate Now
            </Link>
          </nav>
        </div>
      </div>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-forest dark:bg-gray-950 text-white pt-16 pb-8 border-t-4 border-coral">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">CryptoCharity</h3>
              <p className="opacity-70">Direct giving, powered by you.</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Stay updated on our impact</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  name="newsletter_email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder:text-white/55 border border-white/20 focus:outline-none focus:ring-2 focus:ring-coral"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'submitting'}
                  className="bg-coral text-white font-bold px-6 py-3 rounded-md hover:bg-coral/90 transition-colors disabled:bg-gray-400"
                >
                  {newsletterStatus === 'submitting' ? 'Submitting…' : 'Subscribe'}
                </button>
              </form>
              <div aria-live="polite" aria-atomic="true">
                {newsletterStatus === 'success' && (
                  <p className="text-primary-400 mt-2">Thank you for subscribing!</p>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-red-400 mt-2">Something went wrong. Please try again.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-5">
            <div className="text-sm opacity-60 mb-4 sm:mb-0">
              © {new Date().getFullYear()} CryptoCharity. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms"   className="hover:text-primary-400 transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link>
            </div>
            {/* Only render social links that have a real URL */}
            {SOCIAL_ICONS.some(({ key }) => SOCIAL_LINKS[key]) && (
              <div className="flex gap-5 mt-6 sm:mt-0">
                {SOCIAL_ICONS.filter(({ key }) => SOCIAL_LINKS[key]).map(({ key, Icon, label }) => (
                  <a
                    key={key}
                    href={SOCIAL_LINKS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-2xl hover:text-primary-400 transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
