import React from 'react';
import usePageTitle from '../hooks/usePageTitle';
import { FiTarget, FiEye, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const teamMembers = [
  // FIXED IMAGE LINKS
  { name: 'Alex Johnson', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2862&q=80' },
  { name: 'Maria Garcia', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80' },
  { name: 'Sam Chen', role: 'Lead Engineer', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80' },
];

export default function About() {
  usePageTitle('About Us');

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-28 px-6 text-white bg-green-700 text-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold" data-aos="fade-up">We believe in aid rooted in dignity.</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg opacity-90" data-aos="fade-up" data-aos-delay="100">
            Poverty is a lack of cash, not a lack of character. We provide a direct, efficient, and transparent path for your donation to empower people in need.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <FiTarget className="text-green-600 h-12 w-12 mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To give people the freedom to choose how to best improve their lives. We send cryptocurrency directly and transparently, empowering individuals to overcome poverty on their own terms.
            </p>
          </div>
          <div data-aos="fade-left">
            <FiEye className="text-green-600 h-12 w-12 mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a future where all people have the resources to live a life of dignity and choice. A world where humanitarian aid is personal, impactful, and radically transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Why Crypto Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4" data-aos="fade-up">The Crypto Advantage</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16" data-aos="fade-up" data-aos-delay="100">
            Blockchain isn't just a buzzword; it's the engine for a better model of charity.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8" data-aos="fade-up" data-aos-delay="100">
              <FiZap className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold mb-2">Unmatched Speed</h3>
              <p className="text-gray-600">Funds can reach recipients in minutes, not weeks, bypassing slow, traditional banking systems.</p>
            </div>
            <div className="p-8" data-aos="fade-up" data-aos-delay="200">
              <FiTarget className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold mb-2">Drastic Efficiency</h3>
              <p className="text-gray-600">By cutting out intermediaries, more of your donation (over 90%) goes directly to the person who needs it.</p>
            </div>
            <div className="p-8" data-aos="fade-up" data-aos-delay="300">
              <FiEye className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold mb-2">Radical Transparency</h3>
              <p className="text-gray-600">Every step of the donation process is verifiable on a public blockchain, building unparalleled trust.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-12" data-aos="fade-up">Meet Our Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                  {teamMembers.map((member, index) => (
                      <div key={member.name} data-aos="fade-up" data-aos-delay={index * 100}>
                          <img src={member.image} alt={member.name} className="h-40 w-40 rounded-full mx-auto mb-4 object-cover shadow-lg" />
                          <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                          <p className="text-green-600 font-semibold">{member.role}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700">
        <div className="max-w-4xl mx-auto text-center py-20 px-6">
            <h2 className="text-4xl font-extrabold text-white mb-4" data-aos="fade-up">Ready to be part of the change?</h2>
            <div className="mt-8" data-aos="fade-up" data-aos-delay="100">
                <Link to="/donate" className="inline-block px-12 py-4 bg-white text-green-700 font-bold rounded-full shadow-lg hover:scale-105 transform transition-transform text-lg">
                    Donate Now
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}