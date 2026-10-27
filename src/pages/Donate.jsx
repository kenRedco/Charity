import React, { useState } from 'react';
import { ClientOnly } from 'vite-react-ssg';
import usePageTitle from '../hooks/usePageTitle';
import PageMeta from '../components/PageMeta';
import QRCode from 'react-qr-code';
import { FiCopy, FiCheckCircle, FiHelpCircle, FiExternalLink } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
const IMG_DONATE_HERO = 'https://images.unsplash.com/photo-1629293360328-fc31e9e735a6?q=80&w=2000&auto=format&fit=crop';
import { DONATION_CURRENCIES } from '../config';

function amountToBaseUnits(amount, decimals) {
  if (!/^\d+(\.\d+)?$/.test(amount)) return '';
  const [whole, fraction = ''] = amount.split('.');
  if (fraction.length > decimals) return '';
  const units = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction.padEnd(decimals, '0'));
  return units > 0n ? units.toString() : '';
}

export default function Donate() {
  usePageTitle('Donate Now');
  const [currencyCode, setCurrencyCode] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');

  const currency = DONATION_CURRENCIES[currencyCode];
  const amountBaseUnits = amountToBaseUnits(amount, currency.decimals);
  const canSendFromBrowserWallet = currencyCode === 'ETH';
  const explorerUrl = currencyCode === 'ETH' ? 'https://etherscan.io/tx/' : '';

  const handleCurrencyChange = (code) => {
    setCurrencyCode(code);
    setAmount('');
    setError('');
    setTransactionHash('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currency.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not access the clipboard. Select and copy the address instead.');
    }
  };

  const handleDonate = async () => {
    setError('');
    setTransactionHash('');
    if (!canSendFromBrowserWallet || !amountBaseUnits) return;

    const provider = window.ethereum;
    if (!provider?.request) {
      setError('No browser wallet found. Install a wallet such as MetaMask, or use the QR code or address below.');
      return;
    }

    setSending(true);
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (Number.parseInt(chainId, 16) !== currency.chainId) {
        throw new Error(`Switch your wallet to ${currency.network} before sending.`);
      }
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: accounts[0], to: currency.address, value: `0x${BigInt(amountBaseUnits).toString(16)}` }],
      });
      setTransactionHash(hash);
    } catch (sendError) {
      if (sendError.code === 4001) {
        setError('The transaction was cancelled in your wallet. No donation was sent.');
      } else {
        setError(sendError.message || 'The wallet could not send this transaction.');
      }
    } finally {
      setSending(false);
    }
  };

  const qrCodeValue = (() => {
    if (currency.qrScheme === 'ethereum') {
      return `ethereum:${currency.address}@${currency.chainId}${amountBaseUnits ? `?value=${amountBaseUnits}` : ''}`;
    }
    if (currency.qrScheme === 'bitcoin') {
      return `bitcoin:${currency.address}${amountBaseUnits ? `?amount=${encodeURIComponent(amount)}` : ''}`;
    }
    if (currency.qrScheme === 'solana') {
      return `solana:${currency.address}${amountBaseUnits ? `?amount=${encodeURIComponent(amount)}` : ''}`;
    }
    return currency.address;
  })();

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageMeta
        title="Donate Crypto — Give Directly to Families in Need"
        description="Send a cryptocurrency donation directly to the configured recipient wallet. Review the network, recipient, and amount before confirming in your wallet."
        path="/donate"
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen">

        {/* Left Side - Image & Mission */}
        <div className="relative hidden lg:block">
          {/* ⬇️ CHANGED: use local asset instead of external URL */}
          <img
            src={IMG_DONATE_HERO}
            alt="Smiling child, symbolizing the impact of your donation"
            className="absolute h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-green-800/60 flex flex-col justify-end p-12 text-white">
            <h1 className="text-5xl font-extrabold leading-tight" data-aos="fade-up">
              Your Gift is the Beginning of Their Story.
            </h1>
            <p className="mt-4 text-lg opacity-90 max-w-lg" data-aos="fade-up" data-aos-delay="100">
              Your contribution goes to the recipient wallet shown here. Review the amount and network carefully before confirming.
            </p>
          </div>
        </div>

        {/* Right Side - Donation UI */}
        <div className="py-16 px-6 sm:px-12 lg:px-16">
          <div className="max-w-lg mx-auto lg:mx-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 mb-3">Direct giving · {currency.network}</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Give directly, on-chain.</h2>
            <p className="text-lg text-gray-600 mb-8">Choose a cryptocurrency, review its network and recipient, then confirm the payment in your wallet.</p>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100" data-aos="fade-up">
              <h3 className="text-2xl font-bold text-gray-800">Make a donation</h3>
              <p className="text-gray-600 mt-1 mb-6">Select a currency and enter an optional amount.</p>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">Cryptocurrency</legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Choose a cryptocurrency">
                  {Object.entries(DONATION_CURRENCIES).map(([code, option]) => (
                    <button
                      key={code}
                      type="button"
                      aria-pressed={currencyCode === code}
                      onClick={() => handleCurrencyChange(code)}
                      className={`rounded-md border px-3 py-3 text-left transition ${currencyCode === code ? 'border-primary-600 bg-primary-50 text-primary-800 ring-2 ring-primary-500' : 'border-gray-300 text-gray-700 hover:border-primary-400'}`}
                    >
                      <span className="block font-semibold">{option.name}</span>
                      <span className="block text-xs text-gray-500">{option.ticker}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mt-5 mb-1">Donation amount ({currency.ticker})</label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  pattern="[0-9]*[.]?[0-9]*"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-describedby="amount-help amount-error"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currency.ticker}</span>
              </div>
              <p id="amount-help" className="text-xs text-gray-500 mt-2">Amount is optional. Confirm the currency and network in your wallet before sending.</p>
              {amount && !amountBaseUnits && <p id="amount-error" className="text-sm text-red-700 mt-2" role="alert">Enter a positive {currency.ticker} amount with no more than {currency.decimals} decimal places.</p>}
              {canSendFromBrowserWallet ? (
                <button
                  type="button"
                  onClick={handleDonate}
                  disabled={!amountBaseUnits || sending}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <FaWallet aria-hidden="true" />
                  {sending ? 'Check your wallet...' : `Continue with ${currency.name} wallet`}
                </button>
              ) : (
                <p className="mt-5 rounded-md bg-blue-50 p-3 text-sm text-blue-800" role="status">Scan the QR code with a {currency.name} wallet or copy the address below. This browser does not submit {currency.ticker} transactions.</p>
              )}
              {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
              {transactionHash && (
                <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-900" role="status">
                  <p className="font-semibold">Transaction submitted. Thank you.</p>
                  <p className="mt-1 break-all font-mono">{transactionHash}</p>
                  {explorerUrl && (
                    <a className="mt-2 inline-flex items-center gap-1 font-semibold underline" href={`${explorerUrl}${transactionHash}`} target="_blank" rel="noreferrer">
                      View transaction <FiExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {currency.address && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8" data-aos="fade-up" data-aos-delay="100">
                <h3 className="text-xl font-bold text-gray-800">Or send from any wallet</h3>
                <p className="text-gray-600 mt-1 mb-5">Scan the payment request or copy the recipient address.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="p-2 bg-white border border-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <ClientOnly fallback={<div className="w-full h-full bg-gray-100 rounded animate-pulse" />}>
                      {() => <QRCode value={qrCodeValue} size={192} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />}
                    </ClientOnly>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{currency.name} recipient · {currency.network}</span>
                      <button type="button" onClick={handleCopy} aria-label={copied ? 'Address copied' : 'Copy wallet address'} className="p-2 text-gray-500 hover:text-primary-600">
                        {copied ? <FiCheckCircle className="text-primary-600" /> : <FiCopy />}
                      </button>
                    </div>
                    <code className="block break-all bg-gray-100 text-gray-700 p-3 rounded-md text-sm font-mono">{currency.address}</code>
                    <div className="mt-4 flex items-start gap-3 bg-blue-50 text-blue-800 p-3 rounded-lg">
                      <FiHelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-sm">Only send {currency.ticker} on {currency.network}. {currencyCode === 'TRX' ? 'The QR contains the recipient address; enter the amount in your wallet.' : 'Confirm the recipient and network in your wallet before approving.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
