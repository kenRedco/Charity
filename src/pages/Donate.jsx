import React, { useState } from 'react';
import { ClientOnly } from 'vite-react-ssg';
import usePageTitle from '../hooks/usePageTitle';
import PageMeta from '../components/PageMeta';
import QRCode from 'react-qr-code';
import { FiCopy, FiCheckCircle, FiHelpCircle, FiAlertTriangle } from 'react-icons/fi';
import { SiBinance, SiCoinbase } from 'react-icons/si';
import { FaWallet } from 'react-icons/fa';
import LiveDonationFeed from '../components/LiveDonationFeed';
import donateChild from '../assets/donateChild.png';
import { DONATION_WALLET } from '../config';

/** Convert an ETH string to a wei integer string for EIP-681 URIs.
 *  value= in the ethereum: URI spec is denominated in wei, not ETH. */
function ethToWei(ethStr) {
  const parsed = parseFloat(ethStr);
  if (!ethStr || isNaN(parsed) || parsed <= 0) return '';
  return BigInt(Math.round(parsed * 1e18)).toString();
}

export default function Donate() {
  usePageTitle('Donate Now');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DONATION_WALLET.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // EIP-681 URI — value must be in wei, not ETH
  const amountWei = ethToWei(amount);
  const qrCodeValue = `ethereum:${DONATION_WALLET.address}@${DONATION_WALLET.chainId}${
    amountWei ? `?value=${amountWei}` : ''
  }`;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageMeta
        title="Donate Crypto — Give Directly to Families in Need"
        description="Donate cryptocurrency directly to families living in poverty. Scan the QR code or copy the wallet address. 91% of every donation reaches recipients."
        path="/donate"
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen">

        {/* Left Side - Image & Mission */}
        <div className="relative hidden lg:block">
          {/* ⬇️ CHANGED: use local asset instead of external URL */}
          <img
            src={donateChild}
            alt="Smiling child, symbolizing the impact of your donation"
            className="absolute h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-green-800/60 flex flex-col justify-end p-12 text-white">
            <h1 className="text-5xl font-extrabold leading-tight" data-aos="fade-up">
              Your Gift is the Beginning of Their Story.
            </h1>
            <p className="mt-4 text-lg opacity-90 max-w-lg" data-aos="fade-up" data-aos-delay="100">
              Direct giving is more than a donation; it's a transfer of trust and power.
              100% of public crypto donations fund our programs.
            </p>
          </div>
        </div>

        {/* Right Side - Donation UI */}
        <div className="py-16 px-6 sm:px-12 lg:px-16">
          <div className="max-w-lg mx-auto lg:mx-0">
            {/* ⚠️ Remove this banner once the real wallet address is set in src/config.js */}
            {DONATION_WALLET.address === '0xb543c83D838eCbca569a3D9F76B5f446369A1234' && (
              <div className="mb-6 flex items-start gap-3 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl">
                <FiAlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-600" />
                <p className="text-sm font-medium">
                  <strong>Demo mode:</strong> The wallet address shown is a placeholder. Replace{' '}
                  <code className="font-mono bg-yellow-100 px-1 rounded">DONATION_WALLET.address</code> in{' '}
                  <code className="font-mono bg-yellow-100 px-1 rounded">src/config.js</code> before accepting real donations.
                </p>
              </div>
            )}

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
                <div className="col-span-1">
                  <div className="p-1 bg-white rounded-lg shadow-md aspect-square flex items-center justify-center">
                    <ClientOnly fallback={<div className="w-full h-full bg-gray-100 rounded animate-pulse" />}>
                      <QRCode
                        value={qrCodeValue}
                        size={256}
                        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                      />
                    </ClientOnly>
                  </div>
                </div>
                <div className="col-span-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pre-fills the amount in your wallet.</p>
                </div>
              </div>
            </div>

            {/* --- Path 2: Exchanges & Desktop --- */}
            <div
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3 className="text-2xl font-bold text-gray-800">2. For Exchanges or Desktop</h3>
              <p className="text-gray-600 mt-1 mb-4">
                Use for Binance, Coinbase.com, Kraken, or from a desktop wallet.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <SiBinance className="h-6 w-6 text-gray-500" title="Binance" />
                <SiCoinbase className="h-6 w-6 text-gray-500" title="Coinbase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copy this Wallet Address</label>
                <div className="relative">
                  <code className="block break-words bg-gray-100 text-gray-700 p-3 rounded-md text-sm font-mono pr-12">
                    {DONATION_WALLET.address}
                  </code>
                  <button
                    onClick={handleCopy}
                    aria-label={copied ? 'Address copied' : 'Copy wallet address'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-primary-600"
                  >
                    {copied ? <FiCheckCircle className="text-primary-600" /> : <FiCopy />}
                  </button>
                </div>
              </div>
              {/* The Explanation Block */}
              <div className="mt-4 flex items-start gap-3 bg-blue-50 text-blue-800 p-3 rounded-lg">
                <FiHelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Why not scan for exchanges?</strong> Exchange apps (like Binance) can't read payment QR
                  codes. Please use the 'Copy Address' method when sending from an exchange.
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
