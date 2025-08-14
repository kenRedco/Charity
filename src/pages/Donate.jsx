import React, { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import QRCode from 'react-qr-code';
import { FiCopy, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { SiBinance, SiCoinbase } from 'react-icons/si';
import { FaWallet } from 'react-icons/fa';
import LiveDonationFeed from '../components/LiveDonationFeed';

const mainWallet = {
  address: '0xb543c83D838eCbca569a3D9F76B5f446369A1234', // Example Address
  chainId: 1, // 1 is the official Chain ID for Ethereum Mainnet
};

export default function Donate() {
  usePageTitle('Donate Now');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mainWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- CORRECTED QR CODE VALUE ---
  // This now includes the Chain ID (`@1`) to prevent the MetaMask error.
  const qrCodeValue = `ethereum:${mainWallet.address}@${mainWallet.chainId}${amount ? `?value=${amount}` : ''}`;

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen">
        
        {/* Left Side - Image & Mission */}
        <div className="relative hidden lg:block">
          <img src="https://images.unsplash.com/photo-1579208585934-8c886a111a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80" alt="A child receiving support" className="absolute h-full w-full object-cover" />
          <div className="absolute inset-0 bg-green-800/60 flex flex-col justify-end p-12 text-white">
            <h1 className="text-5xl font-extrabold leading-tight" data-aos="fade-up">Your Gift is the Beginning of Their Story.</h1>
            <p className="mt-4 text-lg opacity-90 max-w-lg" data-aos="fade-up" data-aos-delay="100">
              Direct giving is more than a donation; it's a transfer of trust and power. 100% of public crypto donations fund our programs.
            </p>
          </div>
        </div>

        {/* Right Side - Donation UI */}
        <div className="py-16 px-6 sm:px-12 lg:px-16">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Choose Your Donation Method</h2>
            <p className="text-lg text-gray-600 mb-8">We support all major wallets and exchanges.</p>

            {/* --- Path 1: Mobile Wallets --- */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100" data-aos="fade-up">
              <h3 className="text-2xl font-bold text-gray-800">1. For Mobile Wallets (Recommended)</h3>
              <p className="text-gray-600 mt-1 mb-4">Scan with MetaMask, Trust Wallet, Coinbase Wallet, etc.</p>
              
              <div className="flex items-center gap-4 mb-6">
                  <FaWallet className="h-8 w-8 text-gray-500" title="Crypto Wallets" />
                  <p className="font-semibold text-gray-600">...and any other mobile wallet.</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1"><div className="p-1 bg-white rounded-lg shadow-md aspect-square flex items-center justify-center"><QRCode value={qrCodeValue} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} /></div></div>
                <div className="col-span-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
                  <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <p className="text-xs text-gray-500 mt-1">Pre-fills the amount in your wallet.</p>
                </div>
              </div>
            </div>

            {/* --- Path 2: Exchanges & Desktop --- */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold text-gray-800">2. For Exchanges or Desktop</h3>
              <p className="text-gray-600 mt-1 mb-4">Use for Binance, Coinbase.com, Kraken, or from a desktop wallet.</p>
               <div className="flex items-center gap-4 mb-6">
                  <SiBinance className="h-6 w-6 text-gray-500" title="Binance" />
                  <SiCoinbase className="h-6 w-6 text-gray-500" title="Coinbase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copy this Wallet Address</label>
                <div className="relative">
                  <code className="block break-words bg-gray-100 text-gray-700 p-3 rounded-md text-sm font-mono pr-12">{mainWallet.address}</code>
                  <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-green-600">{copied ? <FiCheckCircle className="text-green-600" /> : <FiCopy />}</button>
                </div>
              </div>
              {/* The Explanation Block */}
              <div className="mt-4 flex items-start gap-3 bg-blue-50 text-blue-800 p-3 rounded-lg">
                <FiHelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Why not scan for exchanges?</strong> Exchange apps (like Binance) can't read payment QR codes. Please use the 'Copy Address' method when sending from an exchange.
                </p>
              </div>
            </div>

            {/* Live Donations Feed */}
            <LiveDonationFeed />
          </div>
        </div>
      </div>
    </div>
  );
}