import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ClientOnly } from 'vite-react-ssg';
import usePageTitle from "../hooks/usePageTitle";
import useCountUp from "../hooks/useCountUp";
import PageMeta from "../components/PageMeta";
import clothingDrive from "../assets/C15DAB55-1AE7-4CCD-8F51-A9148E3B9298 (1).png";
import toyDrive from "../assets/D5572509-624D-4778-80D5-17738F0418E6.png";

// Icons
import { FiUsers, FiTrendingUp, FiTarget, FiGlobe } from 'react-icons/fi';
import { GiReceiveMoney, GiChoice } from 'react-icons/gi';
import { IoIosGitNetwork } from 'react-icons/io';

// Globe is a heavy three.js dependency — load lazily, render client-only
const GlobeSection = lazy(() => import('../components/GlobeSection'));

// --- Data for the page ---
const impactStats = [
  { icon: FiUsers, numericEnd: 10000, prefix: '', suffix: '+', label: "Families Supported" },
  { icon: FiTrendingUp, numericEnd: 12, prefix: '$', suffix: 'M+', label: "Delivered Directly" },
  { icon: FiGlobe, numericEnd: 4, prefix: '', suffix: '', label: "Countries Reached" },
];

function StatCard({ icon: Icon, numericEnd, prefix, suffix, label, aosDelay }) {
  const { ref, value } = useCountUp(numericEnd, { duration: 1800 });
  return (
    <div ref={ref} className="p-4" data-aos="fade-up" data-aos-delay={aosDelay}>
      <Icon className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
      <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-1" aria-label={`${prefix}${numericEnd}${suffix}`}>
        {prefix}{value.toLocaleString()}{suffix}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg font-medium">{label}</p>
    </div>
  );
}

const howItWorksSteps = [
  { icon: GiReceiveMoney, title: "You Donate Crypto", description: "Make a secure, low-fee donation using your preferred cryptocurrency." },
  { icon: IoIosGitNetwork, title: "We Send It Directly", description: "Funds are delivered straight to the mobile money accounts of families in poverty." },
  { icon: GiChoice, title: "They Choose Their Future", description: "Recipients use funds for what they need most—a business, school, or medicine." }
];


export default function Home() {
  usePageTitle("Empowering Lives Through Direct Crypto Giving");

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 overflow-x-hidden">
      <PageMeta
        title="CryptoCharity — Direct Crypto Donations to Families in Need"
        description="CryptoCharity supports direct crypto donations to families in need with transparent, dignified humanitarian aid."
        path="/"
        includeJsonLd
      />
      {/* --- Hero Section --- */}
      <section className="relative h-[84svh] min-h-[620px] flex items-center text-white">
        <div className="absolute inset-0">
          <img src={clothingDrive} alt="Neighbors gather around donated clothing at an outdoor community drive" className="w-full h-full object-cover object-center" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-16">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-coral-200" data-aos="fade-up">Dignity, in every gesture</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl leading-[1.05] mb-5 drop-shadow-xl" data-aos="fade-up">
            Empowering Lives Through Direct Crypto Giving
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-lg md:text-xl opacity-95" data-aos="fade-up" data-aos-delay="200">
            Every shared resource can make a difficult day lighter. See neighbors come together to sort clothing, water, toys, and everyday essentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4" data-aos="fade-up" data-aos-delay="400">
            <Link to="/donate" className="w-full sm:w-auto inline-block px-8 py-4 bg-coral text-white font-bold rounded-md shadow-lg hover:bg-coral-800 transform transition-all text-lg">
              Donate Now
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto inline-block px-8 py-4 text-white font-semibold border border-white/50 rounded-md hover:bg-white/15 transition-colors text-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- Impact Stats Section --- */}
      <section className="py-14 sm:py-18 bg-paper dark:bg-gray-900 border-y border-forest/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {impactStats.map((stat, index) => (
              <StatCard key={stat.label} {...stat} aosDelay={index * 100} />
            ))}
          </div>
        </div>
      </section>
      
      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-forest text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4" data-aos="fade-up">A Revolution in Giving</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-20" data-aos="fade-up" data-aos-delay="100">
            Our process is simple, direct, and radically transparent.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {howItWorksSteps.map((step, index) => (
              <div key={step.title} className="p-7 bg-white/5 rounded-xl border border-white/15 hover:bg-white/10 transition-colors text-left" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-coral-200">0{index + 1}</span>
                <step.icon className="h-9 w-9 mt-5 mb-5 text-coral-200"/>
                <h3 className="text-2xl mb-2">{step.title}</h3>
                <p className="opacity-80 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Impact Overview Section --- */}
      <section className="py-20 sm:py-24 bg-white dark:bg-gray-950" id="impact-overview">
        <div className="max-w-6xl mx-auto px-6">
          {/* Headline + intro */}
          <div className="text-center">
            <h2
              className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4"
              data-aos="fade-up"
            >
              From Code to Concrete Change
            </h2>
            <p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Neighbors gather around a shared collection of toys and play materials, choosing what will bring a little more joy home.
            </p>
          </div>

          {/* Media + copy */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image with hover overlay */}
            <div
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/5"
              data-aos="fade-right"
            >
              <img
                src={toyDrive}
                alt="Children explore donated toys and play materials at a community distribution"
                className="absolute inset-0 w-full h-full object-cover object-center motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
                loading="eager"
              />

              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Hover text reveal */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="translate-y-2 motion-safe:transition-transform duration-500 group-hover:translate-y-0">
                  <span className="inline-block text-xs font-semibold tracking-wide uppercase text-white/90">
                    Shared essentials
                  </span>
                  <h3 className="mt-1 text-white text-lg font-bold drop-shadow">
                    Play begins with a chance to explore
                  </h3>
                  <p className="mt-1 text-white/90 text-sm line-clamp-3">
                    Toys and learning materials find new hands as families browse a community collection together.
                  </p>
                </div>
              </div>
            </div>

            {/* Text card */}
            <div
              className="journal-panel p-7 sm:p-9 flex flex-col justify-between"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-snug">
                  Care is practical. It looks like the things people need, ready to share.
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A clothing drive becomes a place to find a warm layer, a useful item, or something new for a child. The best support starts by listening to what matters in each moment.
                </p>
              </div>

              {/* Stylish CTA */}
              <div className="mt-8 text-center md:text-left">
                <Link
                  to="/impact"
                  className="inline-flex items-center px-6 py-3 rounded-md bg-coral text-white font-semibold shadow hover:bg-coral-800 motion-safe:transition-all duration-300"
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
                </Link>
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
          <div className="flex justify-center items-center h-[400px] md:h-auto pointer-events-none" data-aos="fade-left">
            <ClientOnly fallback={<div className="h-[400px] w-full" aria-hidden="true" />}>
              {() => (
                <Suspense fallback={<div className="h-[400px] w-full" aria-hidden="true" />}>
                  <GlobeSection />
                </Suspense>
              )}
            </ClientOnly>
          </div>
        </div>
      </section>

    </div>
  );
}