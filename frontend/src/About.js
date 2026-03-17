import React from 'react';

const teamMembers = [
  {
    name: 'Prashant Mahto',
    studentId: 'A00336051',
    role: 'Project Lead, System & Backend Architect',
    avatar: 'https://avatars.githubusercontent.com/PrashantMaht0',
    bio: 'Designed the core system architecture and developed the Node.js backend. Built custom data collection tooling, managed DevOps including GitHub CI/CD pipelines, Azure VM configuration, and custom domain deployment.',
    github: 'https://github.com/PrashantMaht0',
    linkedin: 'https://www.linkedin.com/in/prashant-mahto-',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    badgeText: 'Project Lead',
  },
  {
    name: 'Nitish Mudaliar',
    studentId: 'A00336067',
    role: 'AI/ML Engineer',
    avatar: 'https://avatars.githubusercontent.com/nitishfire',
    bio: 'Led the research and selection of the core LLM. Trained and fine-tuned the model to meet specific dark pattern detection requirements. Configured Hugging Face Space for model deployment and engineered the API infrastructure.',
    github: 'https://github.com/nitishfire',
    linkedin: 'https://www.linkedin.com/in/nitishmudaliar/',
    badgeColor: 'bg-blue-100 text-blue-800',
    badgeText: 'AI/ML',
  },
  {
    name: 'Gunatheeth Reddy Jampala',
    studentId: 'A00335996',
    role: 'Frontend Developer & Content Specialist',
    avatar: 'https://avatars.githubusercontent.com/gunatheeth',
    bio: 'Developed the interactive React frontend architecture and user dashboard. Authored comprehensive articles on dark patterns and GDPR regulations featured on the platform. Collaborated extensively on AI model research.',
    github: 'https://github.com/gunatheeth',
    linkedin: 'https://www.linkedin.com/in/gunatheethreddy',
    badgeColor: 'bg-green-100 text-green-800',
    badgeText: 'Frontend',
  },
];

const contributions = [
  {
    member: 'Prashant Mahto',
    id: 'A00336051',
    role: 'Project Lead, System & Backend Architect',
    color: 'bg-yellow-50',
    items: [
      'Designed the core system architecture and developed the Node.js backend',
      'Built custom data collection tooling to generate the generalized LLM training dataset',
      'Managed DevOps, including GitHub CI/CD pipelines, Azure VM configuration, and custom domain deployment (darkpatterndetector.dev)',
      'Authored all academic documentation, sprint reports, and conference papers',
      'Finalized content strategy for educational blog pages',
    ],
  },
  {
    member: 'Nitish Mudaliar',
    id: 'A00336067',
    role: 'AI/ML Engineer',
    color: 'bg-blue-50',
    items: [
      'Led the research and selection of the core LLM',
      'Trained and fine-tuned the model to meet specific dark pattern detection requirements',
      'Configured the Hugging Face Space for model deployment',
      'Engineered the API infrastructure to allow secure, scalable access to the model',
    ],
  },
  {
    member: 'Gunatheeth Reddy Jampala',
    id: 'A00335996',
    role: 'Frontend Developer & Content Specialist',
    color: 'bg-green-50',
    items: [
      'Developed the interactive React frontend architecture and user dashboard',
      'Authored comprehensive articles on dark patterns and GDPR regulations featured on the platform',
      'Collaborated extensively on AI model research and development',
    ],
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
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100 shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 items-center justify-center text-white text-3xl font-bold hidden">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                {member.badgeText && (
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold mb-2 ${member.badgeColor}`}>
                    {member.badgeText}
                  </span>
                )}
                <p className="text-blue-600 font-medium mb-3 text-sm">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                    <i className="fab fa-github text-xl"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions Table */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Contributions</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-5 py-3 text-sm font-semibold">Team Member</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold">Student ID</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold">Primary Role</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold">Key Contributions</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, i) => (
                  <tr key={i} className={`${c.color} border-b border-gray-200`}>
                    <td className="px-5 py-4 text-sm text-gray-900 font-medium align-top whitespace-nowrap">{c.member}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 align-top whitespace-nowrap">{c.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 align-top">{c.role}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 align-top">
                      <ul className="list-disc list-inside space-y-1">
                        {c.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
