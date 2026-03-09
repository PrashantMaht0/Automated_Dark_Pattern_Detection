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
            Coming soon....
          </p>
        </div>

        
       
      </div>
    </div>
  );
}
