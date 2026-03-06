import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LOADING_STEPS = [
  'Connecting to website...',
  'Fetching page content...',
  'Extracting visible text...',
  'Preprocessing data...',
  'Running Transformer model...',
  'Running Fusion model...',
  'Mapping to GDPR/DSA...',
  'Generating report...',
];

export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [apiDone, setApiDone] = useState(false);
  const navigate = useNavigate();
  const stepInterval = useRef(null);
  const progressInterval = useRef(null);
  const apiDoneRef = useRef(false);
  const reportDataRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stepInterval.current) clearInterval(stepInterval.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // When API completes, fast-forward remaining steps then navigate
  useEffect(() => {
    if (!apiDone || !loading) return;
    if (stepInterval.current) clearInterval(stepInterval.current);
    if (progressInterval.current) clearInterval(progressInterval.current);

    // Fast-forward remaining steps
    let step = currentStep;
    const fastForward = setInterval(() => {
      step += 1;
      if (step >= LOADING_STEPS.length) {
        clearInterval(fastForward);
        setProgressPercent(100);
        // Brief pause at 100% then navigate
        setTimeout(() => {
          if (reportDataRef.current) {
            localStorage.setItem('reportData', JSON.stringify(reportDataRef.current));
          }
          setLoading(false);
          navigate('/report');
        }, 600);
        return;
      }
      setCurrentStep(step);
      setProgressPercent(Math.round(((step + 1) / LOADING_STEPS.length) * 100));
    }, 300);

    return () => clearInterval(fastForward);
  }, [apiDone]); // eslint-disable-line react-hooks/exhaustive-deps

  const fillExample = () => {
    setWebsiteUrl('https://www.booking.com');
    setError('');
  };

  const generateReport = async () => {
    setError('');

    if (!websiteUrl) {
      setError('Please enter a website URL');
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(websiteUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setCurrentStep(0);
    setProgressPercent(0);
    setApiDone(false);
    apiDoneRef.current = false;
    reportDataRef.current = null;

    // Step animation: advance 1 step every 3s, but stop at step 6 (second-to-last)
    // so "Generating report..." only shows when API finishes
    const maxAutoStep = LOADING_STEPS.length - 2; // stop before last step
    let stepCount = 0;
    stepInterval.current = setInterval(() => {
      if (apiDoneRef.current) return;
      stepCount += 1;
      if (stepCount <= maxAutoStep) {
        setCurrentStep(stepCount);
      }
    }, 3000);

    // Smooth progress bar: crawl from 0% to ~85% over ~30s, then slow to near-halt
    let prog = 0;
    progressInterval.current = setInterval(() => {
      if (apiDoneRef.current) return;
      if (prog < 70) {
        prog += 2;
      } else if (prog < 85) {
        prog += 0.5;
      } else if (prog < 92) {
        prog += 0.1;
      }
      setProgressPercent(Math.round(prog));
    }, 500);

    try {
      const formattedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

      const response = await axios.post(`${API_URL}/audit`, {
        targetUrl: formattedUrl,
      });

      // Build report data
      reportDataRef.current = {
        url: formattedUrl,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        raw: response.data,
        riskScore: 100 - (response.data.report_summary?.trust_score || 100),
        riskLevel: response.data.report_summary?.trust_score >= 80 ? 'Low' : response.data.report_summary?.trust_score >= 50 ? 'Medium' : 'High',
        detectedCount: response.data.detailed_detections?.length || 0,
        avgConfidence: response.data.detailed_detections?.length
          ? Math.round(response.data.detailed_detections.reduce((sum, d) => sum + d.confidence * 100, 0) / response.data.detailed_detections.length)
          : 0,
        trustScore: response.data.report_summary?.trust_score || 100,
        status: response.data.report_summary?.status || 'Compliant',
        results: (response.data.detailed_detections || [])
          .filter(d => d.confidence > 0.30)
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 15)
          .map(d => ({
            type: d.pattern_category || d.label,
            evidence: d.detected_text,
            probability: Math.round(d.confidence * 100),
            gdpr: getGDPRMapping(d.label),
            dsa: getDSAMapping(d.label),
            recommendation: getRecommendation(d.label),
            gate_probability: d.gate_probability,
            router_confidence: d.router_confidence,
            fusion_score: d.fusion_score,
          })),
        regulatory_breakdown: response.data.regulatory_breakdown || [],
        analysis_stats: response.data.analysis_stats || {},
      };

      // Signal that API is done — useEffect will fast-forward steps & navigate
      apiDoneRef.current = true;
      setApiDone(true);
    } catch (err) {
      if (stepInterval.current) clearInterval(stepInterval.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
      setLoading(false);
      console.error(err);
      const rawError = err.response?.data?.error || err.response?.data?.detail || err.message;
      const msg = typeof rawError === 'object' ? JSON.stringify(rawError) : rawError;
      setError(`Analysis failed: ${msg}. Make sure all services are running.`);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              GDPR & DSA Compliant Analysis
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Real-Time Automated Detection and{' '}
              <span className="gradient-text">Regulatory Mapping</span> of Dark Patterns
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Paste a website URL to detect potential dark patterns and generate a compliance-focused report aligned with GDPR and Digital Services Act requirements.
            </p>

            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-xl p-2 max-w-2xl mx-auto border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-link text-gray-400"></i>
                  </div>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-11 pr-4 py-4 rounded-xl border-0 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && generateReport()}
                  />
                </div>
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <span>{loading ? 'Analyzing...' : 'Generate Report'}</span>
                  <i className={loading ? 'fas fa-circle-notch fa-spin ml-2' : 'fas fa-arrow-right ml-2'}></i>
                </button>
              </div>

              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 mt-2">
                <button onClick={fillExample} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors">
                  <i className="fas fa-magic mr-2"></i>
                  Try Example
                </button>
                <span className="text-xs text-gray-500">Free analysis • No signup required</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-center animate-fade-in">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 hover-lift">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-robot text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Detection</h3>
                <p className="text-gray-600 text-sm">Advanced Transformer models (RoBERTa + Fusion) trained to identify deceptive design patterns with dual-model verification.</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 hover-lift">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-balance-scale text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Regulatory Mapping</h3>
                <p className="text-gray-600 text-sm">Automatic correlation with GDPR articles and DSA obligations for compliance reporting.</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 hover-lift">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-file-alt text-green-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Reports</h3>
                <p className="text-gray-600 text-sm">Exportable PDF and PNG reports with evidence snippets and remediation recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-lg px-4">
            {/* Animated Scanner */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="loading-ring w-full h-full"></div>
              <div className="loading-ring w-full h-full" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative overflow-hidden">
                  <div className="scan-line"></div>
                  <i className="fas fa-search text-3xl text-blue-600 relative z-10"></i>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              {LOADING_STEPS.map((step, index) => (
                index <= currentStep && (
                  <div key={index} className="animate-fade-in">
                    <div className={`flex items-center justify-center space-x-3 ${currentStep === index ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        {currentStep > index ? (
                          <i className="fas fa-check text-sm"></i>
                        ) : currentStep === index ? (
                          <i className="fas fa-circle-notch fa-spin text-sm"></i>
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-lg font-medium ${currentStep === index ? 'text-blue-600' : 'text-gray-800'}`}>
                        {step}
                      </span>
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="mt-2 font-medium">
                {progressPercent >= 100 ? (
                  <span className="text-green-600">
                    <i className="fas fa-check-circle mr-1"></i>Complete — Loading report...
                  </span>
                ) : (
                  `${progressPercent}% Complete`
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper functions for GDPR/DSA mapping
function getGDPRMapping(label) {
  const map = {
    preselected_invasive_default: 'Art. 25 - Data Protection by Design',
    visual_distraction: 'Art. 5(1)(a) - Transparency',
    emotional_steering: 'Art. 7 - Consent Conditions',
    hidden_in_plain_sight: 'Art. 12 - Transparent Information',
    misleading_button: 'Art. 5(1)(a) - Fair Processing',
    overwhelming_options: 'Art. 12(1) - Clear Communication',
    ambiguous_wording: 'Art. 12(1) - Plain Language',
  };
  return map[label] || 'Art. 5 - Principles';
}

function getDSAMapping(label) {
  const map = {
    preselected_invasive_default: 'Art. 27 - No Dark Patterns',
    visual_distraction: 'Art. 27 - Transparency',
    emotional_steering: 'Art. 27 - User Autonomy',
    hidden_in_plain_sight: 'Art. 27 - Interface Clarity',
    misleading_button: 'Art. 27 - No Misleading UI',
    overwhelming_options: 'Art. 27 - Simplicity',
    ambiguous_wording: 'Art. 27 - Clear Language',
  };
  return map[label] || 'Art. 27 - Online Platforms';
}

function getRecommendation(label) {
  const map = {
    preselected_invasive_default: 'Leave all non-essential consent checkboxes unchecked by default.',
    visual_distraction: 'Provide equal visual weight for both Accept and Reject options.',
    emotional_steering: 'Use neutral, objective language for opt-out buttons.',
    hidden_in_plain_sight: 'Ensure opt-out links meet accessibility contrast ratios.',
    misleading_button: 'Button labels must explicitly describe their exact resulting action.',
    overwhelming_options: 'Provide a top-level Reject All button alongside granular settings.',
    ambiguous_wording: 'Use clear, plain language without double negatives.',
  };
  return map[label] || 'Review and remediate the detected pattern to ensure compliance.';
}
