import React, { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import { FiMail, FiMessageSquare, FiInfo, FiLoader, FiCheckCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

export default function Contact() {
  usePageTitle('Contact Us');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // --- Replace these with your actual EmailJS credentials! ---
    const serviceID = 'service_3e587ll';
    const templateID = 'template_ka8678b';
    const publicKey = 'P8nAMYp6uXMDnOwBB';

    emailjs.sendForm(serviceID, templateID, e.target, publicKey)
      .then((result) => {
          setSubmitStatus('success');
          e.target.reset();
      }, (error) => {
          setSubmitStatus('error');
      })
      .finally(() => {
          setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-gray-50">
      <section className="py-28 px-6 bg-green-700 text-center text-white"><h1 className="text-5xl font-extrabold" data-aos="fade-up">Get in Touch</h1><p className="max-w-2xl mx-auto mt-4 text-lg opacity-90" data-aos="fade-up" data-aos-delay="100">We'd love to hear from you. Whether you have a question, a suggestion, or a partnership proposal, please reach out.</p></section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg" data-aos="fade-right">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><label htmlFor="from_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" id="from_name" name="from_name" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
              <div><label htmlFor="from_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" id="from_email" name="from_email" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
              <div><label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea id="message" name="message" rows="5" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea></div>
              <div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold px-6 py-4 rounded-md hover:bg-green-700 transition-colors text-lg flex items-center justify-center disabled:bg-gray-400">
                  {isSubmitting ? <FiLoader className="animate-spin h-6 w-6" /> : 'Send Message'}
                </button>
              </div>
              {submitStatus === 'success' && <div className="flex items-center gap-3 text-green-600 p-3 bg-green-50 rounded-md"><FiCheckCircle /><span>Thank you! Your message has been sent.</span></div>}
              {submitStatus === 'error' && <div className="text-red-600">Something went wrong. Please try again.</div>}
            </form>
          </div>

          <div className="space-y-8" data-aos="fade-left"><div className="bg-white p-6 rounded-xl shadow-lg"><FiMail className="h-8 w-8 text-green-600 mb-3" /><h3 className="text-xl font-bold text-gray-800">General Inquiries</h3><p className="text-gray-600 mt-1">For general questions and information.</p><a href="mailto:info@cryptocharity.org" className="text-green-600 font-semibold mt-2 inline-block hover:underline">info@cryptocharity.org</a></div><div className="bg-white p-6 rounded-xl shadow-lg"><FiMessageSquare className="h-8 w-8 text-green-600 mb-3" /><h3 className="text-xl font-bold text-gray-800">Partnerships</h3><p className="text-gray-600 mt-1">Interested in partnering with us?</p><a href="mailto:partners@cryptocharity.org" className="text-green-600 font-semibold mt-2 inline-block hover:underline">partners@cryptocharity.org</a></div><div className="bg-white p-6 rounded-xl shadow-lg"><FiInfo className="h-8 w-8 text-green-600 mb-3" /><h3 className="text-xl font-bold text-gray-800">Press</h3><p className="text-gray-600 mt-1">For media requests and interviews.</p><a href="mailto:press@cryptocharity.org" className="text-green-600 font-semibold mt-2 inline-block hover:underline">press@cryptocharity.org</a></div></div>

        </div>
      </section>
    </div>
  );
}