import React, { useState } from 'react';
import { ClientOnly } from 'vite-react-ssg';
import usePageTitle from '../hooks/usePageTitle';
import PageMeta from '../components/PageMeta';
import QRCode from 'react-qr-code';
import { FiCopy, FiCheckCircle, FiHelpCircle, FiExternalLink } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
import { SiBitcoin, SiEthereum, SiSolana } from 'react-icons/si';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { DONATION_CURRENCIES } from '../config';

function TronMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fill="#C4342B" fillRule="evenodd" clipRule="evenodd" d="M4.418 3.186a.56.56 0 0 1 .553-.17l11.904 2.915q.108.027.198.092l2.422 1.765a.564.564 0 0 1 .133.774l-8.332 12.192a.563.563 0 0 1-.998-.13L4.306 3.754a.56.56 0 0 1 .112-.568m1.965 3.045 4.16 11.711.684-6.07zm5.957 5.838-.695 6.175 5.884-8.61zm5.72-3.93-3.793 1.78 2.543-2.692zm-2.395-1.343L6.41 4.53l5.426 6.32z" />
    </svg>
  );
}

function XrpMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.36 4.125h2.605l-5.42 5.781A4.92 4.92 0 0 1 12 11.443a4.9 4.9 0 0 1-3.546-1.537L3.026 4.125H5.64l4.112 4.429c1.204 1.277 3.291 1.277 4.496 0zM5.604 19.865H3l5.453-5.763a4.93 4.93 0 0 1 3.55-1.537 4.92 4.92 0 0 1 3.552 1.538L21 19.875h-2.605l-4.138-4.411c-1.205-1.277-3.291-1.277-4.496 0z" />
    </svg>
  );
}

const CURRENCY_MARKS = {
  ETH: { Icon: SiEthereum, color: '#627eea', background: 'bg-[#627eea]/10' },
  BTC: { Icon: SiBitcoin, color: '#f7931a', background: 'bg-[#f7931a]/10' },
  SOL: { Icon: SiSolana, color: '#14a979', background: 'bg-[#14a979]/10' },
  TRX: { Icon: TronMark, color: '#c4342b', background: 'bg-[#c4342b]/10' },
  XRP: { Icon: XrpMark, color: '#23292f', background: 'bg-[#23292f]/10' },
};

function amountToBaseUnits(amount, decimals) {
  if (!/^\d+(\.\d+)?$/.test(amount)) return '';
  const [whole, fraction = ''] = amount.split('.');
  if (fraction.length > decimals) return '';
  const units = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction.padEnd(decimals, '0'));
  return units > 0n ? units.toString() : '';
}

function createXrpPaymentUri(address, amount) {
  return `ripple:${address}?amount=${encodeURIComponent(amount)}`;
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
  const { Icon: CurrencyIcon, color: currencyColor, background: currencyBackground } = CURRENCY_MARKS[currencyCode];
  const amountBaseUnits = amountToBaseUnits(amount, currency.decimals);
  const amountFitsWalletApi = currencyCode === 'ETH' || (amountBaseUnits && BigInt(amountBaseUnits) <= BigInt(Number.MAX_SAFE_INTEGER));
  const xrpPaymentUri = createXrpPaymentUri(currency.address, amount);
  const explorerUrls = {
    ETH: 'https://etherscan.io/tx/',
    BTC: 'https://mempool.space/tx/',
    SOL: 'https://explorer.solana.com/tx/',
    TRX: 'https://tronscan.org/#/transaction/',
  };
  const explorerUrl = explorerUrls[currencyCode];

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
    if (!amountBaseUnits || !amountFitsWalletApi) return;

    if (currencyCode === 'XRP') {
      window.location.assign(xrpPaymentUri);
      window.setTimeout(() => {
        if (!document.hidden) {
          setError('No XRP wallet opened. Scan the XRP payment QR code or copy the address below to continue.');
        }
      }, 1200);
      return;
    }

    const wallets = {
      ETH: window.ethereum,
      BTC: window.unisat,
      SOL: window.phantom?.solana || window.solana,
      TRX: window.tronLink,
    };
    const provider = wallets[currencyCode];
    if (!provider) {
      const walletNames = { ETH: 'MetaMask or another EVM wallet', BTC: 'UniSat Wallet', SOL: 'Phantom or another Solana wallet', TRX: 'TronLink' };
      setError(`${walletNames[currencyCode]} was not detected. Install or unlock it, then try again. You can also scan the QR code or copy the address.`);
      return;
    }

    setSending(true);
    try {
      let hash;
      if (currencyCode === 'ETH') {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (!accounts?.[0]) throw new Error('No wallet account is available. Unlock your wallet and try again.');
        const chainId = await provider.request({ method: 'eth_chainId' });
        if (Number.parseInt(chainId, 16) !== currency.chainId) {
          throw new Error(`Switch your wallet to ${currency.network} before sending.`);
        }
        hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: accounts[0], to: currency.address, value: `0x${BigInt(amountBaseUnits).toString(16)}` }],
        });
      } else if (currencyCode === 'BTC') {
        const network = await provider.getNetwork();
        if (network !== 'livenet') throw new Error('Switch UniSat to Bitcoin mainnet before sending.');
        hash = await provider.sendBitcoin(currency.address, Number(amountBaseUnits));
      } else if (currencyCode === 'SOL') {
        await provider.connect();
        const sender = provider.publicKey;
        if (!sender) throw new Error('No Solana wallet account is connected. Unlock your wallet and try again.');
        const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        const transaction = new Transaction({ feePayer: new PublicKey(sender.toString()), recentBlockhash: blockhash }).add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(sender.toString()),
            toPubkey: new PublicKey(currency.address),
            lamports: Number(amountBaseUnits),
          })
        );
        const result = await provider.signAndSendTransaction(transaction);
        hash = typeof result === 'string' ? result : result?.signature;
        if (!hash) throw new Error('The Solana wallet did not return a transaction signature.');
        await connection.confirmTransaction({ signature: hash, blockhash, lastValidBlockHeight }, 'confirmed');
      } else if (currencyCode === 'TRX') {
        await provider.request({ method: 'tron_requestAccounts' });
        const tronWeb = window.tronWeb;
        const sender = tronWeb?.defaultAddress?.base58;
        if (!sender || !tronWeb?.transactionBuilder || !tronWeb?.trx) {
          throw new Error('TronLink is not connected to an account. Unlock it and try again.');
        }
        const host = tronWeb.fullNode?.host || '';
        if (/nile|shasta|testnet/i.test(host)) throw new Error('Switch TronLink to TRON mainnet before sending.');
        const transaction = await tronWeb.transactionBuilder.sendTrx(currency.address, Number(amountBaseUnits), sender);
        const signedTransaction = await tronWeb.trx.sign(transaction);
        const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
        if (!result?.result) throw new Error(result?.message ? tronWeb.toUtf8(result.message) : 'The TRON network rejected the transaction.');
        hash = result.txid || signedTransaction.txID;
      }
      setTransactionHash(hash);
    } catch (sendError) {
      if (sendError.code === 4001 || sendError.code === 'ACTION_REJECTED') {
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
    if (currencyCode === 'XRP' && amountBaseUnits) {
      return xrpPaymentUri;
    }
    return currency.address;
  })();

  return (
    <div className="bg-paper dark:bg-gray-950">
      <PageMeta
        title="Donate Crypto — Give Directly to Families in Need"
        description="Send a cryptocurrency donation directly to the configured recipient wallet. Review the network, recipient, and amount before confirming in your wallet."
        path="/donate"
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen bg-paper dark:bg-gray-950">

        {/* Left Side - Global generosity artwork & mission */}
        <div className="relative hidden min-h-screen overflow-hidden bg-paper dark:bg-gray-950 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_36%,rgba(102,136,115,0.2),transparent_42%),linear-gradient(155deg,#f6f4eb_0%,#edf1e8_50%,#f6f4eb_100%)] dark:bg-[radial-gradient(ellipse_at_50%_36%,rgba(102,136,115,0.28),transparent_42%),linear-gradient(155deg,#030712_0%,#030712_50%,#030712_100%)]" />
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 900 1100"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <defs>
              <radialGradient id="globeGlow" cx="0" cy="0" r="1" gradientTransform="matrix(0 410 -410 0 450 370)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F4B77B" stopOpacity=".34" />
                <stop offset=".52" stopColor="#8FB79A" stopOpacity=".15" />
                <stop offset="1" stopColor="#8FB79A" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="globeSurface" cx="0" cy="0" r="1" gradientTransform="matrix(330 355 -355 330 320 205)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#DCE8DA" stopOpacity=".28" />
                <stop offset=".56" stopColor="#8FB79A" stopOpacity=".12" />
                <stop offset="1" stopColor="#164536" stopOpacity=".16" />
              </radialGradient>
              <linearGradient id="globeRim" x1="258" x2="653" y1="180" y2="618" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F2C18C" stopOpacity=".82" />
                <stop offset=".46" stopColor="#DCE8DA" stopOpacity=".48" />
                <stop offset="1" stopColor="#8FB79A" stopOpacity=".12" />
              </linearGradient>
              <linearGradient id="networkLine" x1="220" x2="700" y1="240" y2="650" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F2C18C" stopOpacity=".88" />
                <stop offset="1" stopColor="#DCE8DA" stopOpacity=".25" />
              </linearGradient>
              <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <clipPath id="globeClip">
                <circle cx="450" cy="396" r="205" />
              </clipPath>
            </defs>

            <circle cx="450" cy="396" r="355" fill="url(#globeGlow)" />
            <circle cx="450" cy="396" r="278" stroke="#DCE8DA" strokeOpacity=".09" />
            <circle cx="450" cy="396" r="244" stroke="#DCE8DA" strokeOpacity=".12" strokeDasharray="2 12" />
            <circle cx="450" cy="396" r="205" fill="url(#globeSurface)" stroke="url(#globeRim)" strokeWidth="1.5" />

            <g clipPath="url(#globeClip)" className="stroke-forest/25 dark:stroke-sage/30" strokeOpacity=".9">
              <ellipse cx="450" cy="396" rx="88" ry="205" />
              <ellipse cx="450" cy="396" rx="158" ry="205" />
              <path d="M239 396h422M260 326c102 54 278 54 380 0M260 466c102-54 278-54 380 0M294 257c91 49 221 49 312 0M294 535c91-49 221-49 312 0" />
              <path d="M282 298c41 18 64 48 69 84-37 23-61 52-67 88m216-211c-35 28-50 58-43 92 44 14 75 37 96 71-15 35-20 69-11 103" className="stroke-leaf/60 dark:stroke-sage/40" />
            </g>

            <g stroke="url(#networkLine)" strokeWidth="1.4">
              <path d="m209 270 82 48 54-91 105 63 81-104 82 111 91-25M188 481l99-49 58 86 103-58 88 102 73-81 83 32M291 318l-4 114m58-205 14 291m91-228 0 170m81-274 7 332m75-221-2 140" />
              <path d="M291 318 450 396l81-209m-244 294 163-85 176 44 73-81" strokeOpacity=".44" />
            </g>
            <g fill="#F2C18C">
              <circle cx="209" cy="270" r="4" />
              <circle cx="291" cy="318" r="5" />
              <circle cx="345" cy="227" r="4" />
              <circle cx="450" cy="290" r="5" />
              <circle cx="531" cy="187" r="4" />
              <circle cx="613" cy="298" r="5" />
              <circle cx="704" cy="273" r="4" />
              <circle cx="188" cy="481" r="4" />
              <circle cx="287" cy="432" r="5" />
              <circle cx="345" cy="518" r="4" />
              <circle cx="450" cy="460" r="5" />
              <circle cx="538" cy="562" r="4" />
              <circle cx="611" cy="481" r="5" />
              <circle cx="694" cy="513" r="4" />
            </g>
            <g fill="#F2C18C" filter="url(#softGlow)" opacity=".55">
              <circle cx="291" cy="318" r="7" />
              <circle cx="450" cy="290" r="7" />
              <circle cx="613" cy="298" r="7" />
              <circle cx="287" cy="432" r="7" />
              <circle cx="450" cy="460" r="7" />
              <circle cx="611" cy="481" r="7" />
            </g>

            <g className="motion-safe:origin-center motion-safe:animate-[spin_90s_linear_infinite]" style={{ transformOrigin: '450px 396px' }}>
              <circle cx="450" cy="396" r="247" stroke="#F2C18C" strokeOpacity=".32" strokeDasharray="1 9" />
              <circle cx="450" cy="149" r="5" fill="#F2C18C" />
              <circle cx="697" cy="396" r="3" fill="#DCE8DA" fillOpacity=".8" />
            </g>

            <g transform="translate(276 620)">
              <rect width="348" height="88" rx="28" fill="#164536" fillOpacity=".94" stroke="#DCE8DA" strokeOpacity=".32" />
              <circle cx="46" cy="44" r="25" fill="#D97758" />
              <path d="M46 54s-13-7.6-13-15.4a6.7 6.7 0 0 1 13-2.2 6.7 6.7 0 0 1 13 2.2C59 46.4 46 54 46 54Z" fill="#FFF6E9" />
              <text x="86" y="39" fill="#DCE8DA" fontFamily="DM Sans, sans-serif" fontSize="11" fontWeight="700" letterSpacing="1.8">A GIFT IN MOTION</text>
              <text x="86" y="59" fill="#FFFFFF" fillOpacity=".88" fontFamily="DM Sans, sans-serif" fontSize="13">Direct support. Real people.</text>
              <path d="M302 44h20m-7-7 7 7-7 7" stroke="#F2C18C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/35 to-transparent dark:from-gray-950 dark:via-gray-950/30 dark:to-transparent" />
          <div className="absolute left-10 top-10 flex items-center gap-3 text-leaf/90 dark:text-sage/80 xl:left-14 xl:top-14">
            <span className="h-px w-8 bg-coral/80" />
            <span className="eyebrow">One world. More ways to care.</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-10 text-forest dark:text-white xl:p-14">
            <p className="eyebrow mb-4 text-leaf dark:text-sage">A direct act of care</p>
            <h1 className="max-w-xl text-5xl leading-[1.05] xl:text-6xl" data-aos="fade-up">
              Your Gift is the Beginning of Their Story.
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-forest/80 dark:text-white/85" data-aos="fade-up" data-aos-delay="100">
              Your contribution goes to the recipient wallet shown here. Review the amount and network carefully before confirming.
            </p>
          </div>
        </div>

        {/* Right Side - Donation UI */}
        <div className="py-16 px-6 sm:px-12 lg:px-16">
          <div className="max-w-lg mx-auto lg:mx-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 mb-3">Direct giving · {currency.network}</p>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Give directly, on-chain.</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Choose a cryptocurrency, review its network and recipient, then confirm the payment in your wallet.</p>

            <div className="journal-panel p-6 sm:p-8" data-aos="fade-up">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Make a donation</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 mb-6">Select a currency and enter an optional amount.</p>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cryptocurrency</legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Choose a cryptocurrency">
                  {Object.entries(DONATION_CURRENCIES).map(([code, option]) => (
                    (() => {
                      const { Icon, color, background } = CURRENCY_MARKS[code];
                      const isSelected = currencyCode === code;

                      return (
                        <button
                          key={code}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleCurrencyChange(code)}
                          className={`flex min-h-[76px] items-center gap-2 rounded-md border px-2.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral sm:gap-3 sm:px-3 ${isSelected ? 'border-coral bg-coral-50 ring-2 ring-coral dark:border-coral-200 dark:bg-coral-800/20' : 'border-gray-300 bg-white hover:border-forest/40 dark:border-gray-600 dark:bg-gray-900'}`}
                        >
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${background}`}>
                            <Icon className="h-6 w-6" style={{ color }} aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-gray-800 dark:text-gray-100">{option.name}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{option.ticker}</span>
                          </span>
                        </button>
                      );
                    })()
                  ))}
                </div>
              </fieldset>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-5 mb-1">Donation amount ({currency.ticker})</label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  pattern="[0-9]*[.]?[0-9]*"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-14 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-describedby="amount-help amount-error"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">{currency.ticker}</span>
              </div>
              <p id="amount-help" className="text-xs text-gray-500 dark:text-gray-400 mt-2">Amount is optional. Confirm the currency and network in your wallet before sending.</p>
              {amount && !amountBaseUnits && <p id="amount-error" className="text-sm text-red-700 dark:text-red-300 mt-2" role="alert">Enter a positive {currency.ticker} amount with no more than {currency.decimals} decimal places.</p>}
              {amountBaseUnits && !amountFitsWalletApi && <p id="amount-error" className="text-sm text-red-700 dark:text-red-300 mt-2" role="alert">This amount exceeds the supported range for the selected wallet. Use a smaller amount to avoid rounding.</p>}
              <button
                type="button"
                onClick={handleDonate}
                disabled={!amountBaseUnits || !amountFitsWalletApi || sending}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 font-semibold text-white transition hover:bg-coral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-600"
              >
                <FaWallet aria-hidden="true" />
                {sending ? 'Check your wallet...' : `Continue with ${currency.name} wallet`}
              </button>
              {error && <p className="mt-4 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>}
              {transactionHash && (
                <div className="mt-4 rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-4 text-sm text-green-900 dark:text-green-100" role="status">
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
              <div className="journal-panel p-6 sm:p-8 mt-8" data-aos="fade-up" data-aos-delay="100">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Or send from any wallet</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 mb-5">Scan the payment request or copy the recipient address.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div data-payment-request={qrCodeValue} className="relative flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-600">
                    <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded bg-gray-100" />}>
                      {() => <QRCode value={qrCodeValue} size={192} level="H" style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />}
                    </ClientOnly>
                    <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm" aria-hidden="true">
                      <span className={`flex h-full w-full items-center justify-center rounded-md ${currencyBackground}`}>
                        <CurrencyIcon className="h-6 w-6" style={{ color: currencyColor }} />
                      </span>
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currency.name} recipient · {currency.network}</span>
                      <button type="button" onClick={handleCopy} aria-label={copied ? 'Address copied' : 'Copy wallet address'} className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md">
                        {copied ? <FiCheckCircle className="text-primary-600" /> : <FiCopy />}
                      </button>
                    </div>
                    <code className="block break-all bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-3 rounded-md text-sm font-mono">{currency.address}</code>
                    <div className="mt-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 p-3 rounded-lg">
                      <FiHelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-sm">Only send {currency.ticker} on {currency.network}. {currencyCode === 'XRP' ? 'The payment QR includes the recipient and amount.' : currencyCode === 'TRX' ? 'The QR contains the recipient address; enter the amount in your wallet.' : 'Confirm the recipient and network in your wallet before approving.'}</p>
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
