import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

export default function TermsOfService() {
  usePageTitle('Terms of Service');

  return (
    <div className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <h2 className="text-2xl font-bold mt-8">1. Agreement to Terms</h2>
          <p>
            By using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the site. We reserve the right to modify these terms at any time.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">2. Use of the Website</h2>
          <p>
            You agree to use the website only for lawful purposes. You are prohibited from any use of the website that would constitute an illegal offense, give rise to liability, or otherwise violate any applicable local, state, national, or international law or regulation.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">3. Donations</h2>
          <p>
            All donations are made voluntarily. We do not offer refunds. Please be aware that transactions on the blockchain are irreversible. We are not responsible for any lost or misdirected funds. Donors are responsible for any transaction fees ("gas fees") associated with their donation.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">4. Limitation of Liability</h2>
          <p>
            This website and its content are provided on an "as is" basis. CryptoCharity makes no warranties of any kind, express or implied, as to the operation of the site or the information, content, or materials included on this site. We will not be liable for any damages of any kind arising from the use of this site.
          </p>


        </div>
      </div>
    </div>
  );
}