export const SITE_URL = 'https://kenRedco.github.io/Charity';
export const SITE_BASENAME = '/Charity';

export const SITE_META = {
  name: 'CryptoCharity',
  tagline: 'Direct Crypto Donations to Families in Need',
  description:
    'CryptoCharity supports direct crypto donations to families in need with transparent, dignified humanitarian aid powered by blockchain.',
  shareImage: `${SITE_URL}/og-image.png`,
};

export const EMAILJS = {
  serviceId: 'service_3e587ll',
  contactTemplateId: 'template_ka8678b',
  newsletterTemplateId: 'template_92u6w3h',
  publicKey: 'P8nAMYp6uXMDnOwBB',
};

export const DONATION_CURRENCIES = {
  ETH: {
    name: 'Ethereum',
    ticker: 'ETH',
    network: 'Ethereum Mainnet',
    address: '0xb7C350525c18A0bC661f458985080673e31E4D29',
    decimals: 18,
    chainId: 1,
    qrScheme: 'ethereum',
  },
  BTC: {
    name: 'Bitcoin',
    ticker: 'BTC',
    network: 'Bitcoin',
    address: 'bc1q04krdeysznun22clwd622qn3tm4sttmd7gpgsu',
    decimals: 8,
    qrScheme: 'bitcoin',
  },
  SOL: {
    name: 'Solana',
    ticker: 'SOL',
    network: 'Solana Mainnet',
    address: '5LvekVwCyvhsFrBfREyca9qhz4KXPFJNnbzSWEF7s5mE',
    decimals: 9,
    qrScheme: 'solana',
  },
  TRX: {
    name: 'TRON',
    ticker: 'TRX',
    network: 'TRON Mainnet',
    address: 'TVMtzPdo5Zh3D33Qdjpo3KzTUrvRYZTE8j',
    decimals: 6,
    qrScheme: 'address',
  },
};

// Set a URL string for links that exist; leave as empty string to hide the icon.
export const SOCIAL_LINKS = {
  twitter: '',
  facebook: '',
  linkedin: '',
  instagram: '',
};
