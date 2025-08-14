import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

export default function PrivacyPolicy() {
  usePageTitle('Privacy Policy');

  return (
    <div className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="lead">
            Welcome to CryptoCharity. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>

          <h2 className="text-2xl font-bold mt-8">1. What Information Do We Collect?</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include: names, email addresses, and contact or authentication data.
          </p>
          <p>
            We also automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">2. How Do We Use Your Information?</h2>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul>
            <li>To send you marketing and promotional communications.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">3. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>


        </div>
      </div>
    </div>
  );
}