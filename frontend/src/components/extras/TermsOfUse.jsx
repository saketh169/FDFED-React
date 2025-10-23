import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfUse = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E6F5C]">Terms and Conditions</h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Welcome to Nutri-Connect! By accessing this website, we assume you accept these terms and conditions. Do not continue to use Nutri-Connect if you do not agree to all the terms and conditions stated on this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: October 22, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              1. Intellectual Property Rights
            </h2>
            <p>
              Other than the content you own, under these terms, Nutri-Connect and/or its licensors own all the intellectual property rights and materials contained in this website. You are granted a limited license only for purposes of viewing the material contained on this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              2. Restrictions
            </h2>
            <p>You are specifically restricted from:</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Publishing any website material in any other media without prior consent.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Selling, sublicensing, and/or otherwise commercializing any website material.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Using this website in any way that is or may be damaging to the website.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Using this website in any way that impacts user access to this website.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Engaging in any data mining, data harvesting, data extracting, or any other similar activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              3. User Responsibilities
            </h2>
            <p>As a user of Nutri-Connect, you agree to:</p>
            <ul className="mt-2 space-y-1 ml-5">
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Provide accurate and complete information when using our services.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Use the website only for lawful purposes and in accordance with these terms.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Not use the website to engage in any fraudulent or harmful activities.</li>
              <li className="flex items-start"><span className="text-[#28B463] mr-2">•</span> Not share your account credentials with others or use another user's account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              4. Nutrition Disclaimer
            </h2>
            <p>
              The content provided on Nutri-Connect is for informational purposes only and is not intended as medical advice. Always consult a qualified healthcare professional before making any dietary or lifestyle changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              5. Privacy Policy
            </h2>
            <p>
              Your use of Nutri-Connect is also governed by our{' '}
              <a href="/privacy-policy" className="text-[#28B463] underline hover:text-[#1E6F5C]">
                Privacy Policy
              </a>
              . Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall Nutri-Connect, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              7. Indemnification
            </h2>
            <p>
              You hereby indemnify Nutri-Connect from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              8. Severability
            </h2>
            <p>
              If any provision of these terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              9. Variation of Terms
            </h2>
            <p>
              Nutri-Connect is permitted to revise these terms at any time, and by using this website, you are expected to review these terms on a regular basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              10. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms will be governed by and interpreted in accordance with the laws of <strong>India</strong>, and you submit to the jurisdiction of the courts located in <strong>[Your City], India</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#28B463] mb-3 border-b-2 border-[#E8F5E9] pb-1 inline-block">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these terms, please contact us at{' '}
              <a href="mailto:nutriconnect6@gmail.com" className="text-[#28B463] underline hover:text-[#1E6F5C]">
                nutriconnect6@gmail.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
};

export default TermsOfUse;