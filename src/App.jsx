import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for the mobile menu
import emailjs from '@emailjs/browser';

export default function App() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  
  // --- STATE FOR THE MODERN HEADER ---
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- EFFECT TO DETECT SCROLLING ---
  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled to true if user has scrolled more than 10px, false otherwise
      setScrolled(window.scrollY > 10);
    };

    // Add event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterStatus('submitting');
    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_NEWSLETTER_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';
    const templateParams = { newsletter_email: newsletterEmail };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      }, () => {
        setNewsletterStatus('error');
      });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* --- THE NEW, DYNAMIC HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4 flex justify-between items-center 
        ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
      >
        <Link to="/" className={`text-2xl font-bold transition-colors duration-300 
          ${scrolled ? 'text-green-700' : 'text-white drop-shadow-md'}`}
        >
          CryptoCharity
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={({ isActive }) => `pb-1 border-b-2 transition-colors duration-300 ${isActive ? 'border-green-600' : 'border-transparent'} ${scrolled ? 'text-gray-800 hover:border-green-600' : 'text-white hover:border-white/80'}`}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => `pb-1 border-b-2 transition-colors duration-300 ${isActive ? 'border-green-600' : 'border-transparent'} ${scrolled ? 'text-gray-800 hover:border-green-600' : 'text-white hover:border-white/80'}`}>About</NavLink>
          <NavLink to="/impact" className={({ isActive }) => `pb-1 border-b-2 transition-colors duration-300 ${isActive ? 'border-green-600' : 'border-transparent'} ${scrolled ? 'text-gray-800 hover:border-green-600' : 'text-white hover:border-white/80'}`}>Impact</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `pb-1 border-b-2 transition-colors duration-300 ${isActive ? 'border-green-600' : 'border-transparent'} ${scrolled ? 'text-gray-800 hover:border-green-600' : 'text-white hover:border-white/80'}`}>Contact</NavLink>
        </nav>
        
        {/* Donate Button - Styles adjust based on scroll */}
        <Link to="/donate" className={`hidden md:block font-semibold px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 
          ${scrolled ? 'bg-green-600 text-white shadow-sm hover:bg-green-700' : 'bg-white text-green-700 shadow-md hover:bg-gray-100'}`}
        >
          Donate Now
        </Link>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(true)} className={`text-3xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
            <FiMenu />
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm transition-opacity duration-300 
        ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-16">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white">CryptoCharity</Link>
            <button onClick={() => setIsMenuOpen(false)} className="text-4xl text-white">
              <FiX />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-10">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-semibold text-white">Home</NavLink>
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-semibold text-white">About</NavLink>
            <NavLink to="/impact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-semibold text-white">Impact</NavLink>
            <NavLink to="/contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-semibold text-white">Contact</NavLink>
            <Link to="/donate" onClick={() => setIsMenuOpen(false)} className="mt-8 bg-green-500 text-white font-bold px-10 py-4 rounded-full text-xl">
              Donate Now
            </Link>
          </nav>
        </div>
      </div>
      
      {/* The main content of each page will be rendered here. The `pt-20` or similar class might be needed on top-level page containers if the transparent header overlaps content. The main Outlet itself doesn't need it. */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* --- FOOTER (Unchanged) --- */}
      <footer className="bg-gray-800 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
            {/* ... rest of the footer code remains exactly the same ... */}
            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-1"><h3 className="text-2xl font-bold mb-4">CryptoCharity</h3><p className="opacity-70">Direct giving, powered by you.</p></div>
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Stay updated on our impact</h3>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                        <input type="email" name="newsletter_email" placeholder="Enter your email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} required className="w-full px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <button type="submit" disabled={newsletterStatus === 'submitting'} className="bg-green-500 text-white font-bold px-6 py-3 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400">
                          {newsletterStatus === 'submitting' ? 'Submitting...' : 'Subscribe'}
                        </button>
                    </form>
                    {newsletterStatus === 'success' && <p className="text-green-400 mt-2">Thank you for subscribing!</p>}
                    {newsletterStatus === 'error' && <p className="text-red-400 mt-2">Something went wrong. Please try again.</p>}
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center"><div className="text-sm opacity-60 mb-4 sm:mb-0">© {new Date().getFullYear()} CryptoCharity. All rights reserved.</div><div className="flex items-center gap-4 text-sm opacity-80"><Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link><Link to="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link><Link to="/contact" className="hover:text-green-400 transition-colors">Contact</Link></div><div className="flex gap-5 mt-6 sm:mt-0"><a href="#" className="text-2xl hover:text-green-400 transition-colors"><FaTwitter /></a><a href="#" className="text-2xl hover:text-green-400 transition-colors"><FaFacebookF /></a><a href="#" className="text-2xl hover:text-green-400 transition-colors"><FaLinkedinIn /></a><a href="#" className="text-2xl hover:text-green-400 transition-colors"><FaInstagram /></a></div></div>
        </div>
      </footer>
    </div>
  );
}