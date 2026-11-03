import React, { useState } from 'react';
import { ClientOnly } from 'vite-react-ssg';
import usePageTitle from '../hooks/usePageTitle';
import PageMeta from '../components/PageMeta';
import QRCode from 'react-qr-code';
import { FiCopy, FiCheckCircle, FiHelpCircle, FiExternalLink } from 'react-icons/fi';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { SiBitcoin, SiEthereum, SiSolana } from 'react-icons/si';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import classroomPhoto from '../assets/45F86866-96E5-4138-8618-B78B3BB6D5A5.png';
import { DONATION_CURRENCIES } from '../config';

const CURRENCY_MARKS = {
  ETH: { Icon: SiEthereum, color: '#627eea', background: 'bg-[#627eea]/10' },
  BTC: { Icon: SiBitcoin, color: '#f7931a', background: 'bg-[#f7931a]/10' },
  SOL: { Icon: SiSolana, color: '#14a979', background: 'bg-[#14a979]/10' },
  TRX: { Icon: FaCoins, color: '#ef0027', background: 'bg-[#ef0027]/10' },
};

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
  const amountFitsWalletApi = currencyCode === 'ETH' || (amountBaseUnits && BigInt(amountBaseUnits) <= BigInt(Number.MAX_SAFE_INTEGER));
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
    return currency.address;
  })();

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageMeta
        title="Donate Crypto — Give Directly to Families in Need"
        description="Send a cryptocurrency donation directly to the configured recipient wallet. Review the network, recipient, and amount before confirming in your wallet."
        path="/donate"
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* Left Side - Image & Mission */}
        <div className="relative hidden lg:block">
          <img
            src={classroomPhoto}
            alt="Children gathered in a colorful classroom as their teacher holds a violin"
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
                  <div className="p-2 bg-white border border-gray-200 dark:border-gray-600 rounded-lg aspect-square flex items-center justify-center">
                    <ClientOnly fallback={<div className="w-full h-full bg-gray-100 rounded animate-pulse" />}>
                      {() => <QRCode value={qrCodeValue} size={192} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />}
                    </ClientOnly>
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
