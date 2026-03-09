import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-sm"></i>
              </div>
              <span className="font-bold text-xl text-gray-900">Dark Pattern Detector</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Automated detection and regulatory mapping of dark patterns to ensure GDPR and DSA compliance. Protecting user rights through transparency.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</Link></li>
              <li><Link to="/regulations" className="text-gray-600 hover:text-blue-600 transition-colors">Regulations</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
            </ul>
          </div>

          
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; 2026 Dark Pattern Detector. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://github.com/PrashantMaht0/Automated_Dark_Pattern_Detection" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors"><i className="fab fa-github text-xl"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
