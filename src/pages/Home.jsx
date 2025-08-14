import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import impactStoryImage from "../assets/storyMotherChildren.png"

// --- Icon & Globe Imports ---
import Globe from 'react-globe.gl';
import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FiUsers, FiTrendingUp, FiTarget, FiGlobe, FiChevronRight } from 'react-icons/fi';
import { GiReceiveMoney, GiChoice } from 'react-icons/gi';
import { IoIosGitNetwork } from 'react-icons/io';

// --- Data for the page ---
const impactStats = [
  { icon: FiUsers, value: "10,000+", label: "Families Supported" },
  { icon: FiTrendingUp, value: "$12M+", label: "Delivered Directly" },
  { icon: FiTarget, value: "91%", label: "Goes to Recipients" },
  { icon: FiGlobe, value: "4", label: "Countries Reached" },
];

const howItWorksSteps = [
  { icon: GiReceiveMoney, title: "You Donate Crypto", description: "Make a secure, low-fee donation using your preferred cryptocurrency." },
  { icon: IoIosGitNetwork, title: "We Send It Directly", description: "Funds are delivered straight to the mobile money accounts of families in poverty." },
  { icon: GiChoice, title: "They Choose Their Future", description: "Recipients use funds for what they need most—a business, school, or medicine." }
];

// --- Globe Component ---
const World = () => {
    const globeEl = useRef();
    const arcsData = [
        { startLat: 34.0522, startLng: -118.2437, endLat: -1.9403, endLng: 29.8739, color: 'rgba(255, 255, 255, 0.6)'},
        { startLat: 40.7128, startLng: -74.0060, endLat: 0.3476, endLng: 32.5825, color: 'rgba(255, 255, 255, 0.6)'},
        { startLat: 51.5072, startLng: -0.1276, endLat: -6.1751, endLng: 106.8650, color: 'rgba(255, 255, 255, 0.6)'}
    ];

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.4;
            globeEl.current.controls().enableZoom = false;
        }
    }, []);

    return <Globe ref={globeEl} globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg" atmosphereColor="#059669" atmosphereAltitude={0.2} arcsData={arcsData} arcColor={'color'} arcDashLength={() => Math.random()} arcDashGap={() => Math.random()} arcDashAnimateTime={() => Math.random() * 4000 + 500} arcStroke={0.5} arcsTransitionDuration={0} width={600} height={600} backgroundColor="rgba(0,0,0,0)" />;
};


export default function Home() {
  usePageTitle("Empowering Lives Through Direct Crypto Giving");
  
  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">
      {/* --- Hero Section --- */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center text-white">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop" alt="Happy children in a community receiving aid" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 via-green-800/20 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-xl" data-aos="fade-up">
            Empowering Lives Through Direct Crypto Giving
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-lg md:text-xl opacity-95" data-aos="fade-up" data-aos-delay="200">
            We deliver humanitarian aid with dignity, transparency, and revolutionary efficiency. Your donation, their choice, our shared impact.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4" data-aos="fade-up" data-aos-delay="400">
            <Link to="/donate" className="w-full sm:w-auto inline-block px-10 py-4 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transform transition-all text-lg">
              Donate Now
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto inline-block px-10 py-4 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- Impact Stats Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {impactStats.map((stat, index) => (
              <div key={stat.label} className="p-4" data-aos="fade-up" data-aos-delay={index * 100}>
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-base md:text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4" data-aos="fade-up">A Revolution in Giving</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-20" data-aos="fade-up" data-aos-delay="100">
            Our process is simple, direct, and radically transparent.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {howItWorksSteps.map((step, index) => (
              <div key={step.title} className="p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/20 transition-all" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <step.icon className="h-16 w-16 mx-auto mb-6 text-white"/>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="opacity-80 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Impact Overview Section --- */}
<section className="py-24 bg-white" id="impact-overview">
  <div className="max-w-6xl mx-auto px-6">
    {/* Headline + intro */}
    <div className="text-center">
      <h2
        className="text-4xl font-extrabold text-gray-900 mb-4"
        data-aos="fade-up"
      >
        From Code to Concrete Change
      </h2>
      <p
        className="text-lg text-gray-700 max-w-3xl mx-auto mb-12"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        See how direct crypto donations empower families to build their own
        futures. Hover over the photo to learn more about this story.
      </p>
    </div>

    {/* Media + copy */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Image with hover overlay */}
      <div
        className="group relative rounded-2xl overflow-hidden shadow-xl"
        data-aos="fade-right"
      >
        <img
          src={impactStoryImage}
          alt="A mother and her two young sons smiling together"
          className="w-full h-full object-cover max-h-[420px] motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 motion-safe:transition-opacity duration-300" />

        {/* Hover text reveal */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 motion-safe:transition-all duration-500">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-white/90">
              East Africa
            </span>
            <h3 className="mt-1 text-white text-lg font-bold drop-shadow">
              A mother invests in her family’s future
            </h3>
            <p className="mt-1 text-white/90 text-sm line-clamp-3">
              A single transfer helped this family cover school fees and set
              aside savings—turning short-term relief into long-term stability.
            </p>
          </div>
        </div>
      </div>

      {/* Text card */}
      <div
        className="bg-gray-50 p-8 rounded-2xl shadow-sm flex flex-col justify-between"
        data-aos="fade-left"
        data-aos-delay="100"
      >
        <div>
          <blockquote className="text-xl italic text-gray-800 mb-4 leading-relaxed">
            “It wasn’t a handout. It was a seed. We invested, and now we can
            plan ahead.”
          </blockquote>
          <p className="text-gray-600">
            Direct giving respects choice. Funds arrive quickly via mobile
            money, letting families invest in what matters most—food, school,
            tools, or savings. Your donation moves with radical transparency
            on-chain and minimal overhead.
          </p>
        </div>

        {/* Stylish CTA */}
        <div className="mt-8 text-center md:text-left">
          <a
            href="/impact"
            className="inline-flex items-center px-6 py-3 rounded-full bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 hover:shadow-xl motion-safe:transition-all duration-300"
          >
            Explore More Impact Stories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

      
      {/* --- Globe Section --- */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
             <h2 className="text-4xl font-extrabold mb-4">Connecting Donors to Communities</h2>
             <p className="text-lg opacity-80 leading-relaxed">
               Our model cuts out the middlemen. We use blockchain to create a direct pathway from you to the people who need it most, no matter where they are in the world. The result is faster, cheaper, and more transparent aid.
             </p>
          </div>
          <div className="flex justify-center items-center h-[400px] md:h-auto" data-aos="fade-left">
             <World />
          </div>
        </div>
      </section>


    </div>
  );
}