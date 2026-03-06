import React from 'react';

const teamMembers = [
  {
    name: 'Nitish',
    initials: 'N',
    role: 'Project Lead & ML Engineer',
    bio: 'Specializes in transformer models and regulatory compliance systems. Led the architecture design and model training pipeline.',
  },
  {
    name: 'Gunna',
    initials: 'G',
    role: 'Backend Developer',
    bio: 'Expert in Python web scraping and API development. Built the Flask backend and integration with ML inference engines.',
  },
  {
    name: 'Prashant',
    initials: 'P',
    role: 'Frontend Developer',
    bio: 'Focused on user experience and data visualization. Designed the reporting interface and export functionality.',
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
            <div className="space-y-4">
              {[
                { title: 'Research & Dataset Curation', desc: 'Compiled comprehensive dataset of 5,000+ labeled dark pattern examples across 12 categories.' },
                { title: 'Model Development', desc: 'Fine-tuned transformer models achieving 94.3% accuracy on dark pattern classification.' },
                { title: 'Regulatory Mapping', desc: 'Mapped detection categories to specific GDPR articles and DSA obligations.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { title: 'Web Application', desc: 'Built responsive React frontend with Tailwind CSS and real-time analysis capabilities.' },
                { title: 'API Development', desc: 'Python FastAPI backend with web scraping and dual-model ML inference endpoints.' },
                { title: 'Report Generation', desc: 'PDF/PNG export functionality with professional compliance formatting.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
            href="https://github.com"
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
