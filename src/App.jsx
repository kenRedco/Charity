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
  const [darkMode, setDarkMode] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
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
    `pb-1 border-b-2 transition-colors duration-300 ${
      isActive ? 'border-primary-600' : 'border-transparent'
    } ${
      scrolled
        ? 'text-gray-800 dark:text-gray-200 hover:border-primary-600'
        : 'text-white hover:border-white/80'
    }`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {/* ── Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4 flex justify-between items-center ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <Link
          to="/"
          className={`text-2xl font-bold transition-colors duration-300 ${
            scrolled ? 'text-primary-700 dark:text-primary-400' : 'text-white drop-shadow-md'
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
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <Link
            to="/donate"
            className={`font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
              scrolled
                ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
                : 'bg-white text-primary-700 shadow-md hover:bg-gray-100'
            }`}
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
        className={`fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm transition-opacity duration-300 ${
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
              className="mt-8 bg-primary-500 text-white font-bold px-10 py-4 rounded-full text-xl"
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
      <footer className="bg-gray-800 dark:bg-gray-950 text-white pt-20 pb-10">
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
                  className="w-full px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'submitting'}
                  className="bg-primary text-white font-bold px-6 py-3 rounded-md hover:bg-primary-700 transition-colors disabled:bg-gray-400"
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

          <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
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
