import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';

const mockDonations = [
  { amount: 0.1,  currency: 'ETH', hash: '0xabc...def' },
  { amount: 1.5,  currency: 'ETH', hash: '0x123...456' },
  { amount: 0.05, currency: 'ETH', hash: '0x789...abc' },
  { amount: 2.0,  currency: 'ETH', hash: '0xdef...123' },
  { amount: 0.25, currency: 'ETH', hash: '0x456...789' },
  { amount: 5.0,  currency: 'ETH', hash: '0xghi...jkl' },
];

const LiveDonationFeed = () => {
  const [donations, setDonations] = useState([mockDonations[0]]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDonations(prev => {
        const nextIndex = prev.length % mockDonations.length;
        return [mockDonations[nextIndex], ...prev].slice(0, 5);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-1 flex items-center">
        <span className="relative flex h-3 w-3 mr-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-600"></span>
        </span>
        Sample Activity
      </h3>
      <p className="text-xs text-gray-400 mb-4 ml-6">
        Simulated data — illustrative only, not real transactions.
      </p>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
        {donations.map((donation, index) => (
          <div
            key={`${donation.hash}-${index}`}
            className="flex items-center justify-between animate-fade-in-up"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FaEthereum className="text-primary-600 h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sample donation received</p>
                <p className="text-sm text-gray-500">
                  {donation.amount} {donation.currency}
                </p>
              </div>
            </div>
            <span
              className="text-sm text-gray-400 font-medium"
              title="Sample data — no real transaction"
            >
              Demo
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDonationFeed;
