import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';

// Mock data to simulate incoming donations
const mockDonations = [
  { amount: 0.1, currency: 'ETH', hash: '0xabc...def' },
  { amount: 1.5, currency: 'ETH', hash: '0x123...456' },
  { amount: 0.05, currency: 'ETH', hash: '0x789...abc' },
  { amount: 2.0, currency: 'ETH', hash: '0xdef...123' },
  { amount: 0.25, currency: 'ETH', hash: '0x456...789' },
  { amount: 5.0, currency: 'ETH', hash: '0xghi...jkl' },
];

const LiveDonationFeed = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Start with one donation immediately if the list is empty
    if (donations.length === 0) {
      setDonations([mockDonations[0]]);
    }

    // Add a new donation every few seconds
    const interval = setInterval(() => {
      setDonations(prevDonations => {
        const nextIndex = (prevDonations.length) % mockDonations.length;
        const newDonation = mockDonations[nextIndex];
        // Add new donation to the top and keep the list from getting too long
        return [newDonation, ...prevDonations].slice(0, 5);
      });
    }, 4000); // Add a new one every 4 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="mt-12" data-aos="fade-up">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="relative flex h-3 w-3 mr-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Live Donations
      </h3>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
        {donations.length === 0 && <p className="text-gray-500">Listening for new donations...</p>}
        {donations.map((donation, index) => (
          <div
            // Using a more robust key than index for animations
            key={`${donation.hash}-${index}`}
            className="flex items-center justify-between animate-fade-in-up"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FaEthereum className="text-green-600 h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">A new donation received!</p>
                <p className="text-sm text-gray-500">
                  {donation.amount} {donation.currency}
                </p>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-green-600 hover:underline font-semibold"
              title="This is a simulated feed"
            >
              Verify
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDonationFeed;