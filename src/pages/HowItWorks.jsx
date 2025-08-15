import React from 'react';
import usePageTitle from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import { FiArrowDownCircle, FiCheckSquare, FiShield, FiSend, FiUserCheck } from 'react-icons/fi';

const timelineSteps = [
  {
    icon: FiArrowDownCircle,
    title: 'Step 1: Your Donation is Made',
    text: 'You make a donation in cryptocurrency to our public, secure wallet address. This transaction is the first step in a fully transparent journey.',
  },
  {
    icon: FiCheckSquare,
    title: 'Step 2: On-Chain Verification',
    text: 'Your donation is instantly recorded and verified on the public blockchain (e.g., Ethereum). This creates a permanent, immutable record that anyone can see, ensuring complete transparency from the very beginning.',
  },
  {
    icon: FiShield,
    title: 'Step 3: Secure Custody & Conversion',
    text: 'Funds are held in our secure, multi-signature wallets. We partner with audited, regulated local financial institutions to convert the cryptocurrency into the local currency (e.g., Kenyan Shillings) with minimal fees.',
  },
  {
    icon: FiSend,
    title: 'Step 4: Direct Mobile Transfer',
    text: 'The converted cash is sent directly to the verified mobile money accounts of recipient families. This method is fast, secure, and widely used, ensuring the funds arrive where they are needed most.',
  },
  {
    icon: FiUserCheck,
    title: 'Step 5: The Recipient\'s Choice',
    text: 'The family receives the funds and can use them for whatever they deem most important—starting a business, paying school fees, buying medicine, or repairing their home. The power is in their hands.',
  },
];

export default function HowItWorks() {
  usePageTitle('How It Works');

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-28 px-6 bg-green-700 text-center text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold" data-aos="fade-up">The Journey of Your Donation</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg opacity-90" data-aos="fade-up" data-aos-delay="100">
            We believe in radical transparency. Follow every step of the process, from your wallet to the hands of those you support.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* The vertical line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" data-aos="fade-up"></div>
            
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative pl-12 pb-16" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="absolute left-0 top-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center ring-8 ring-white">
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4" data-aos="fade-up">Ready to Start a Journey?</h2>
            <p className="text-lg text-gray-700 mb-8" data-aos="fade-up" data-aos-delay="100">
                Your donation can be the catalyst for change. Be a part of the movement.
            </p>
            <div data-aos="fade-up" data-aos-delay="200">
                <Link to="/donate" className="inline-block px-12 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transform transition-all text-lg">
                    Make a Donation
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}