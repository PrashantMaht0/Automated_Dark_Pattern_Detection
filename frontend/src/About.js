import React from 'react';

const teamMembers = [
  {
    name: 'Nitish',
    initials: 'N',
    role: '',
    bio: '',
  },
  {
    name: 'Gunna',
    initials: 'G',
    role: '',
    bio: '',
  },
  {
    name: 'Prashant',
    initials: 'P',
    role: '',
    bio: '',
  },
];

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About the Project</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Developed by a dedicated team committed to digital transparency and user rights protection.
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover-lift">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {member.initials}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><i className="fab fa-linkedin text-xl"></i></a>
                  <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><i className="fab fa-github text-xl"></i></a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Contributions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            Soon to be added with project contributions and acknowledgments.
          </div>
        </div>

        {/* GitHub Section */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <i className="fab fa-github text-6xl text-white mb-4"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Open Source</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            This project is open source and available on GitHub. We welcome contributions, bug reports, and feature requests from the community.
          </p>
          <a
            href="https://github.com/PrashantMaht0/Automated_Dark_Pattern_Detection"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            <i className="fab fa-github mr-2"></i>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
