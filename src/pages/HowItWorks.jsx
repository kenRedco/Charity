import React, { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import PageMeta from '../components/PageMeta';
import { Link } from 'react-router-dom';
import { FiArrowDownCircle, FiCheckSquare, FiHeart, FiInfo, FiShield, FiSend, FiTrendingUp, FiUserCheck } from 'react-icons/fi';

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

const spendingExamples = [
  {
    id: 'programmes',
    label: 'Charitable programmes',
    percentage: 85,
    color: '#668873',
    icon: FiHeart,
    description: 'Hypothetical support for charitable programmes and aid delivery. This is an example category, not a record of CryptoCharity disbursements.',
  },
  {
    id: 'administration',
    label: 'Administration',
    percentage: 10,
    color: '#d9aa4c',
    icon: FiShield,
    description: 'Hypothetical essential operating costs, such as governance, compliance, financial controls, and recordkeeping. No actual expenses are represented.',
  },
  {
    id: 'fundraising',
    label: 'Fundraising',
    percentage: 5,
    color: '#d97758',
    icon: FiTrendingUp,
    description: 'Hypothetical donor outreach and campaign costs. This percentage is illustrative only and is not based on reported fundraising activity.',
  },
];

const spendingCircleLength = 2 * Math.PI * 68;

function SpendingAllocation() {
  const [selectedId, setSelectedId] = useState(spendingExamples[0].id);
  const selectedExample = spendingExamples.find((item) => item.id === selectedId);
  let segmentStart = 0;

  return (
    <section
      id="spending-breakdown"
      aria-labelledby="spending-breakdown-title"
      className="relative overflow-hidden bg-paper py-20 dark:bg-gray-950 sm:py-24"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="eyebrow mb-4 inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-2 text-forest dark:bg-coral/15 dark:text-sage">
            <FiInfo aria-hidden="true" className="text-coral" />
            Illustrative example · not verified
          </p>
          <h2 id="spending-breakdown-title" className="text-4xl text-forest dark:text-white sm:text-5xl">
            Where the money could go
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Explore a hypothetical allocation of 100 units. These percentages are made-up examples—not CryptoCharity financial results, audited figures, or a promise about how donations are used.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-forest/10 bg-white/85 p-6 shadow-[0_20px_60px_rgba(23,58,48,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/85 sm:p-9">
            <div className="relative h-56 w-56" data-aos="zoom-in">
              <svg
                viewBox="0 0 180 180"
                role="img"
                aria-label={`Hypothetical spending example: ${spendingExamples.map((item) => `${item.label} ${item.percentage}%`).join(', ')}`}
                className="h-full w-full -rotate-90"
              >
                <circle cx="90" cy="90" r="68" fill="none" stroke="currentColor" strokeWidth="17" className="text-gray-100 dark:text-gray-800" />
                {spendingExamples.map((item) => {
                  const offset = (spendingCircleLength * segmentStart) / 100;
                  segmentStart += item.percentage;
                  return (
                    <circle
                      key={item.id}
                      cx="90"
                      cy="90"
                      r="68"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="17"
                      strokeDasharray={`${(spendingCircleLength * item.percentage) / 100} ${spendingCircleLength}`}
                      strokeDashoffset={-offset}
                      className={`transition-opacity duration-300 ${selectedId === item.id ? 'opacity-100' : 'opacity-60'}`}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold leading-none text-forest dark:text-white">
                  {selectedExample.percentage}%
                </span>
                <span className="mt-2 max-w-28 text-xs font-semibold uppercase leading-snug tracking-wider text-gray-500 dark:text-gray-400">
                  example share
                </span>
              </div>
            </div>
            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              A visual example only—not a financial report.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {spendingExamples.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-controls="spending-example-detail"
                    onClick={() => setSelectedId(item.id)}
                    className={`flex min-h-20 items-center gap-3 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 ${
                      isSelected
                        ? 'border-forest/25 bg-white shadow-md dark:border-white/25 dark:bg-gray-900'
                        : 'border-forest/10 bg-white/55 hover:bg-white/85 dark:border-white/10 dark:bg-gray-900/45 dark:hover:bg-gray-900/80'
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ color: item.color, backgroundColor: `${item.color}20` }}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100 sm:text-base">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Illustrative allocation</span>
                    </span>
                    <span className="text-2xl font-semibold tabular-nums text-forest dark:text-white">{item.percentage}%</span>
                  </button>
                );
              })}
            </div>

            <div
              id="spending-example-detail"
              aria-live="polite"
              aria-atomic="true"
              className="flex-1 rounded-2xl border border-forest/10 bg-white/75 p-5 dark:border-white/10 dark:bg-gray-900/70 sm:p-6"
            >
              <p className="eyebrow mb-2 text-forest dark:text-sage">Example category</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedExample.label}</h3>
              <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{selectedExample.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 rounded-2xl border border-coral/20 bg-coral/5 p-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <FiInfo aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
          <p>
            No supporting financial documents are linked for this illustration. Replace these hypothetical percentages with verified figures and source documents before presenting an actual spending breakdown.
          </p>
        </div>
      </div>
    </section>
  );
}


export default function HowItWorks() {
  usePageTitle('How It Works');

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      <PageMeta
        title="How It Works — The Journey of Your Crypto Donation"
        description="Follow every step of your crypto donation: from your wallet to verified recipient families. Radical transparency via public blockchain records."
        path="/process"
      />
      {/* Hero Section */}
      <section className="page-hero px-6 py-24 sm:py-28 text-center text-white">
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-coral-200">A clear path, every step</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight" data-aos="fade-up">The Journey of Your Donation</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg opacity-90" data-aos="fade-up" data-aos-delay="100">
            We believe in radical transparency. Follow every step of the process, from your wallet to the hands of those you support.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 sm:py-24 px-6 bg-paper dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* The vertical line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" data-aos="fade-up"></div>
            
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative pl-12 pb-16" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="absolute left-0 top-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center ring-8 ring-white dark:ring-gray-950">
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpendingAllocation />

      {/* Final CTA */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4" data-aos="fade-up">Ready to Start a Journey?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8" data-aos="fade-up" data-aos-delay="100">
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