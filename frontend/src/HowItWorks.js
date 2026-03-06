import React from 'react';

export default function HowItWorks() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our sophisticated pipeline combines web scraping, natural language processing, and regulatory expertise to identify dark patterns.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-16 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-globe text-2xl text-blue-600"></i>
                  </div>
                  <p className="text-sm font-medium">URL Input</p>
                </div>
                <div className="hidden md:block text-gray-400"><i className="fas fa-arrow-right text-2xl"></i></div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-code text-2xl text-purple-600"></i>
                  </div>
                  <p className="text-sm font-medium">Text Extraction</p>
                </div>
                <div className="hidden md:block text-gray-400"><i className="fas fa-arrow-right text-2xl"></i></div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-brain text-2xl text-green-600"></i>
                  </div>
                  <p className="text-sm font-medium">AI Analysis</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <i className="fas fa-arrow-down text-2xl text-gray-400 mx-4"></i>
              </div>
              <div className="mt-6 bg-orange-50 rounded-xl p-4 max-w-md mx-auto border border-orange-200">
                <div className="flex items-center justify-center space-x-2">
                  <i className="fas fa-file-alt text-orange-600"></i>
                  <span className="font-medium text-orange-800">Compliance Report</span>
                </div>
              </div>
            </div>
            <p className="text-gray-500 mt-4 text-sm">System Architecture Overview</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">1</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fetch Website Content</h3>
              <p className="text-gray-600 mb-3">Our system retrieves the visible text content from the provided URL, handling JavaScript-rendered content and various web frameworks.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">HTTP/HTTPS</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">SPA Support</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">Dynamic Content</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">2</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Preprocess and Clean Text</h3>
              <p className="text-gray-600 mb-3">Raw HTML is processed to extract meaningful text, removing scripts, styles, and boilerplate content while preserving context.</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>HTML parsing and DOM traversal</li>
                <li>Text normalization and tokenization</li>
                <li>Duplicate content removal</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">3</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Run Dual AI Models</h3>
              <p className="text-gray-600 mb-3">Text segments pass through a two-stage pipeline: RoBERTa gate model for binary classification, then a fusion model and pattern router for category-level detection.</p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700">
                Gate Model: RoBERTa binary classifier<br />
                Fusion Model: PyTorch multimodal fusion<br />
                Pattern Router: TF-IDF + LogReg (6 categories)<br />
                Ensemble: Weighted average of all models
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">4</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Map to GDPR/DSA Concerns</h3>
              <p className="text-gray-600 mb-3">Detected patterns are mapped to specific regulatory obligations and potential violations.</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-red-50 border border-red-100 rounded-lg p-2 text-xs">
                  <span className="font-semibold text-red-800">GDPR Art. 7</span>
                  <p className="text-red-600">Consent conditions</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 text-xs">
                  <span className="font-semibold text-orange-800">DSA Art. 27</span>
                  <p className="text-orange-600">Transparency</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">5</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Report and Recommendations</h3>
              <p className="text-gray-600 mb-3">Comprehensive reports with risk scores, evidence snippets, and actionable remediation steps. Export as PDF or PNG.</p>
            </div>
          </div>
        </div>

        {/* Advanced Mode */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-camera text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Mode: Screenshot + OCR</h3>
              <p className="text-gray-600 mb-4">For enhanced detection, our system captures visual screenshots and performs OCR on cookie banners, pop-ups, and visual deceptive elements that may not be captured in HTML text alone.</p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-full text-sm">Selenium</span>
                <span className="px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-full text-sm">Tesseract OCR</span>
                <span className="px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-full text-sm">Computer Vision</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
