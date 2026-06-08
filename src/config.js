export const SITE_URL = 'https://kenRedco.github.io/Charity';
export const SITE_BASENAME = '/Charity';

export const SITE_META = {
  name: 'CryptoCharity',
  tagline: 'Direct Crypto Donations to Families in Need',
  description:
    'CryptoCharity delivers direct crypto donations to families in need. 91% of funds go directly to recipients — transparent, fast, and dignified humanitarian aid powered by blockchain.',
  shareImage: `${SITE_URL}/og-image.png`,
};

export const EMAILJS = {
  serviceId: 'service_3e587ll',
  contactTemplateId: 'template_ka8678b',
  newsletterTemplateId: 'template_92u6w3h',
  publicKey: 'P8nAMYp6uXMDnOwBB',
};

// ⚠️  REQUIRED ACTION BEFORE LAUNCH:
//    Replace the address below with a real, verified wallet address that you control.
//    NEVER use this placeholder for real donations — it is not owned by CryptoCharity.
//    After replacing, also update the chainId if you are deploying on a different network.
export const DONATION_WALLET = {
  address: '0xb543c83D838eCbca569a3D9F76B5f446369A1234', // ← REPLACE BEFORE LAUNCH
  chainId: 1, // 1 = Ethereum Mainnet
};

// Set a URL string for links that exist; leave as empty string to hide the icon.
export const SOCIAL_LINKS = {
  twitter: '',
  facebook: '',
  linkedin: '',
  instagram: '',
};
