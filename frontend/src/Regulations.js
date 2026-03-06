import React from 'react';

const darkPatterns = [
  { type: 'Confirmshaming', concern: 'Emotional manipulation affecting consent validity', example: 'No thanks, I hate saving money', badgeClass: 'bg-red-100 text-red-800' },
  { type: 'Sneak into Basket', concern: 'Lack of transparency in pricing', example: 'Added protection plan (+$5.99)', badgeClass: 'bg-orange-100 text-orange-800' },
  { type: 'Hidden Costs', concern: 'Incomplete information before transaction', example: 'Processing fee applied at checkout', badgeClass: 'bg-yellow-100 text-yellow-800' },
  { type: 'False Urgency', concern: 'Misleading commercial practices', example: 'Sale ends in 2 minutes!', badgeClass: 'bg-purple-100 text-purple-800' },
  { type: 'Privacy Zuckering', concern: 'Invalid consent under GDPR', example: 'Share data [pre-checked box]', badgeClass: 'bg-blue-100 text-blue-800' },
  { type: 'Roach Motel', concern: 'Obstruction of user rights', example: 'Subscribe in 1 click, cancel via phone only', badgeClass: 'bg-pink-100 text-pink-800' },
];

export default function Regulations() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR & DSA Regulations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Understanding the legal framework against dark patterns in digital services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What are Dark Patterns?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dark patterns are user interface designs carefully crafted to trick users into doing things they might not otherwise do, such as buying insurance with their purchase or signing up for recurring bills.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These deceptive design practices exploit cognitive biases and manipulate user decision-making, often leading to financial loss, privacy violations, or unintended commitments.
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-gavel text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Key Legal Obligations</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <i className="fas fa-check-circle text-purple-600 mt-1"></i>
                <span><strong>Consent Clarity:</strong> Consent must be freely given, specific, informed, and unambiguous (GDPR Art. 4)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check-circle text-purple-600 mt-1"></i>
                <span><strong>No Misleading Choices:</strong> Interface design must not obscure, subvert, or impair user autonomy (DSA Art. 27)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check-circle text-purple-600 mt-1"></i>
                <span><strong>Transparency:</strong> Clear information about data processing and service terms (GDPR Art. 12-14)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check-circle text-purple-600 mt-1"></i>
                <span><strong>Withdrawal Rights:</strong> Easy withdrawal of consent as easy as giving it (GDPR Art. 7(3))</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dark Patterns Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dark Pattern Classification Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Concern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example Text</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {darkPatterns.map((pattern, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pattern.badgeClass}`}>
                        {pattern.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pattern.concern}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 italic">"{pattern.example}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Penalties Section */}
        <div className="mt-12 bg-red-50 rounded-2xl p-8 border border-red-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-red-600"></i>
            Regulatory Penalties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">GDPR Violations</h4>
              <p className="text-gray-700 text-sm mb-2">Up to €20 million or 4% of annual global turnover (whichever is higher) for infringements of core principles including consent and transparency.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">DSA Violations</h4>
              <p className="text-gray-700 text-sm mb-2">Up to 6% of global annual turnover for systemic violations of transparency and user protection obligations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
