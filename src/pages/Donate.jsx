import React, { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import PageMeta from '../components/PageMeta';
import QRCode from 'react-qr-code';
import { FiCopy, FiCheckCircle, FiHelpCircle, FiAlertTriangle, FiExternalLink } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
const IMG_DONATE_HERO = 'https://images.unsplash.com/photo-1629293360328-fc31e9e735a6?q=80&w=2000&auto=format&fit=crop';
import { DONATION_WALLET } from '../config';

function ethToWei(amount) {
  if (!/^\d+(\.\d{1,18})?$/.test(amount)) return '';
  const [whole, fraction = ''] = amount.split('.');
  const wei = BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'));
  return wei > 0n ? `0x${wei.toString(16)}` : '';
}

export default function Donate() {
  usePageTitle('Donate Now');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');

  const recipientConfigured = /^0x[a-fA-F0-9]{40}$/.test(DONATION_WALLET.address);
  const amountWei = ethToWei(amount);
  const chainName = DONATION_WALLET.chainId === 1 ? 'Ethereum Mainnet' : `Network ${DONATION_WALLET.chainId}`;
  const explorerUrl = DONATION_WALLET.chainId === 1 ? 'https://etherscan.io/tx/' : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_WALLET.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not access the clipboard. Select and copy the address instead.');
    }
  };

  const handleDonate = async () => {
    setError('');
    setTransactionHash('');
    if (!recipientConfigured || !amountWei) return;

    const provider = window.ethereum;
    if (!provider?.request) {
      setError('No browser wallet found. Install a wallet such as MetaMask, or use the QR code or address below.');
      return;
    }

    setSending(true);
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (Number.parseInt(chainId, 16) !== DONATION_WALLET.chainId) {
        throw new Error(`Switch your wallet to ${chainName} before sending.`);
      }
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: accounts[0], to: DONATION_WALLET.address, value: amountWei }],
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

  // EIP-681 payment request: value is expressed in wei.
  const qrCodeValue = recipientConfigured
    ? `ethereum:${DONATION_WALLET.address}@${DONATION_WALLET.chainId}${amountWei ? `?value=${BigInt(amountWei).toString()}` : ''}`
    : '';

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
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 mb-3">Direct giving · {chainName}</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Give directly, on-chain.</h2>
            <p className="text-lg text-gray-600 mb-8">Send a native ETH donation from your wallet. You stay in control until you confirm the transaction.</p>

            {!recipientConfigured && (
              <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl" role="status">
                <FiAlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-600" />
                <p className="text-sm">
                  <strong>Donations are not yet enabled.</strong> The recipient wallet has not been configured. No address or payment request will be shown until a verified wallet is added to <code className="font-mono bg-amber-100 px-1 rounded">src/config.js</code>.
                </p>
              </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100" data-aos="fade-up">
              <h3 className="text-2xl font-bold text-gray-800">Make a donation</h3>
              <p className="text-gray-600 mt-1 mb-6">Choose an amount, then review and confirm it in your wallet.</p>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Donation amount (ETH)</label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-describedby="amount-help"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ETH</span>
              </div>
              <p id="amount-help" className="text-xs text-gray-500 mt-2">Ethereum network fees are paid separately by your wallet.</p>
              {amount && !amountWei && <p className="text-sm text-red-700 mt-2" role="alert">Enter an amount greater than zero with no more than 18 decimal places.</p>}
              <button
                type="button"
                onClick={handleDonate}
                disabled={!recipientConfigured || !amountWei || sending}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <FaWallet aria-hidden="true" />
                {sending ? 'Check your wallet...' : 'Continue with wallet'}
              </button>
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

            {recipientConfigured && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8" data-aos="fade-up" data-aos-delay="100">
                <h3 className="text-xl font-bold text-gray-800">Or send from any wallet</h3>
                <p className="text-gray-600 mt-1 mb-5">Scan the payment request or copy the recipient address.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="p-2 bg-white border border-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <QRCode value={qrCodeValue} size={192} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Recipient address · {chainName}</span>
                      <button type="button" onClick={handleCopy} aria-label={copied ? 'Address copied' : 'Copy wallet address'} className="p-2 text-gray-500 hover:text-primary-600">
                        {copied ? <FiCheckCircle className="text-primary-600" /> : <FiCopy />}
                      </button>
                    </div>
                    <code className="block break-all bg-gray-100 text-gray-700 p-3 rounded-md text-sm font-mono">{DONATION_WALLET.address}</code>
                    <div className="mt-4 flex items-start gap-3 bg-blue-50 text-blue-800 p-3 rounded-lg">
                      <FiHelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-sm">Only send ETH on {chainName}. Confirm the recipient and network in your wallet before approving.</p>
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
