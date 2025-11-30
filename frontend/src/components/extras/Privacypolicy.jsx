import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <main className="flex-1 w-[100%] mx-auto p-8 bg-cover bg-center min-h-screen bg-green-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-7xl mx-auto border-2 border-[#E8F5E9]">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E6F5C]">Privacy Policy</h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            At Nutri-Connect, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: October 22, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              1. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start">
                <span className="text-[#28B463] mr-2">•</span>
                <strong>Personal Information:</strong> Name, email address, phone number, and other details you provide when registering or using our services.
              </li>
              <li className="flex items-start">
                <span className="text-[#28B463] mr-2">•</span>
                <strong>Usage Data:</strong> Information about how you interact with our website, such as IP address, browser type, pages visited, and time spent on the site.
              </li>
              <li className="flex items-start">
                <span className="text-[#28B463] mr-2">•</span>
                <strong>Cookies:</strong> We use cookies to enhance your experience and analyze website traffic. You can disable cookies in your browser settings, but this may affect website functionality.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              2. How We Use Your Information
            </h2>
            <p>We use your information for the following purposes:</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> To provide and improve our services.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> To personalize your experience on our website.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> To communicate with you about updates, offers, and promotions.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> To analyze website usage and improve our content and functionality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              3. Sharing Your Information
            </h2>
            <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> <strong>Service Providers:</strong> Trusted third parties who assist us in operating our website and providing services.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              4. Data Security
            </h2>
            <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              5. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Access, update, or delete your personal information.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Opt-out of receiving promotional communications.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Request a copy of the data we hold about you.</li>
            </ul>
            <p className="mt-2 text-sm italic">
              These rights are protected under the <strong>Digital Personal Data Protection Act, 2023 (India)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              6. Third-Party Links
            </h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. Please review their privacy policies before providing any personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              7. Changes to This Policy
            </h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              8. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:nutriconnect6@gmail.com" className="text-[#28B463] underline hover:text-[#1E6F5C]">
                nutriconnect6@gmail.com
              </a>.
            </p>
          </section>

          {/* === REQUIRED ADDITIONS BELOW (Minimal & Compliant) === */}

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              9. Data Retention
            </h2>
            <p>We retain your data only as long as necessary for the purposes stated or as required by law.</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Inactive accounts are anonymized after <strong>24 months</strong>.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Some data may be kept longer for legal or audit purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              10. Children’s Privacy
            </h2>
            <p>Nutri-Connect is not intended for users under <strong>13 years</strong>. We do not knowingly collect data from children.</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> If discovered, such data will be deleted immediately.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Parents may contact us for data removal.</li>
            </ul>
          </section>

        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;