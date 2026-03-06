import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const patternClasses = {
  'Confirmshaming': 'bg-red-100 text-red-800',
  'Consent Manipulation': 'bg-red-100 text-red-800',
  'False Urgency': 'bg-orange-100 text-orange-800',
  'Urgency': 'bg-orange-100 text-orange-800',
  'Scarcity': 'bg-yellow-100 text-yellow-800',
  'Sneak into Basket': 'bg-yellow-100 text-yellow-800',
  'Hidden Costs': 'bg-purple-100 text-purple-800',
  'Privacy Zuckering': 'bg-blue-100 text-blue-800',
  'Social Proof / Framing': 'bg-blue-100 text-blue-800',
  'Roach Motel': 'bg-pink-100 text-pink-800',
  'Forced Continuity / Subscription': 'bg-pink-100 text-pink-800',
  'Misdirection / Confirmshaming': 'bg-red-100 text-red-800',
  'Other / Unknown': 'bg-gray-100 text-gray-800',
  'preselected_invasive_default': 'bg-red-100 text-red-800',
  'visual_distraction': 'bg-orange-100 text-orange-800',
  'emotional_steering': 'bg-purple-100 text-purple-800',
  'hidden_in_plain_sight': 'bg-yellow-100 text-yellow-800',
  'misleading_button': 'bg-pink-100 text-pink-800',
  'overwhelming_options': 'bg-blue-100 text-blue-800',
  'ambiguous_wording': 'bg-indigo-100 text-indigo-800',
};

export default function Report() {
  const [reportData, setReportData] = useState(null);
  const navigate = useNavigate();
  const reportRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('reportData');
    if (stored) {
      setReportData(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const getPatternClass = (type) => patternClasses[type] || 'bg-gray-100 text-gray-800';

  const downloadPDF = () => {
    const content = reportRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Dark Pattern Compliance Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { font-family: 'Inter', Arial, sans-serif; }
        body { padding: 40px; color: #1F2937; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { border: 1px solid #D1D5DB; padding: 12px; text-align: left; font-size: 13px; }
        th { background: #F3F4F6; font-weight: 700; }
        .badge { display: inline-block; padding: 3px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .risk-high { background: #FEE2E2; color: #991B1B; }
        .risk-medium { background: #FEF3C7; color: #92400E; }
        .risk-low { background: #D1FAE5; color: #065F46; }
        h1 { color: #1E40AF; border-bottom: 3px solid #3B82F6; padding-bottom: 12px; }
        h2 { color: #374151; margin-top: 32px; }
        .summary-box { display: inline-block; padding: 16px 24px; margin: 8px; border-radius: 12px; text-align: center; }
        .evidence { font-style: italic; color: #4B5563; }
        .gdpr-tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin: 2px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <h1>🛡️ Dark Pattern Compliance Report</h1>
      <p><strong>URL:</strong> ${reportData.url} &nbsp;|&nbsp; <strong>Date:</strong> ${reportData.date}</p>
      
      <div style="display: flex; gap: 16px; margin: 20px 0;">
        <div class="summary-box" style="background: ${reportData.riskLevel === 'High' ? '#FEE2E2' : reportData.riskLevel === 'Medium' ? '#FEF3C7' : '#D1FAE5'};">
          <div style="font-size: 32px; font-weight: 800;">${reportData.riskScore}/100</div>
          <div style="font-size: 13px; font-weight: 600;">${reportData.riskLevel} Risk</div>
        </div>
        <div class="summary-box" style="background: #FFF7ED;">
          <div style="font-size: 32px; font-weight: 800;">${reportData.detectedCount}</div>
          <div style="font-size: 13px; font-weight: 600;">Patterns Detected</div>
        </div>
        <div class="summary-box" style="background: #EFF6FF;">
          <div style="font-size: 32px; font-weight: 800;">${reportData.avgConfidence}%</div>
          <div style="font-size: 13px; font-weight: 600;">Avg Confidence</div>
        </div>
        <div class="summary-box" style="background: ${reportData.trustScore >= 80 ? '#D1FAE5' : '#FEE2E2'};">
          <div style="font-size: 32px; font-weight: 800;">${reportData.trustScore}/100</div>
          <div style="font-size: 13px; font-weight: 600;">Trust Score</div>
        </div>
      </div>

      <h2>Detected Dark Patterns</h2>
      <table>
        <thead><tr>
          <th>Pattern Type</th><th>Evidence</th><th>Confidence</th><th>GDPR</th><th>DSA</th><th>Recommendation</th>
        </tr></thead>
        <tbody>
          ${reportData.results.map(r => `<tr>
            <td><strong>${r.type}</strong></td>
            <td class="evidence">"${r.evidence}"</td>
            <td>${r.probability}%</td>
            <td><span class="gdpr-tag" style="background:#FEE2E2;color:#991B1B">${r.gdpr}</span></td>
            <td><span class="gdpr-tag" style="background:#FFF7ED;color:#9A3412">${r.dsa}</span></td>
            <td>${r.recommendation}</td>
          </tr>`).join('')}
        </tbody>
      </table>

      ${reportData.regulatory_breakdown?.length > 0 ? `
        <h2>Regulatory Compliance Breakdown</h2>
        <table>
          <thead><tr><th>Article</th><th>Status</th><th>Impact</th><th>Suggested Fix</th></tr></thead>
          <tbody>
            ${reportData.regulatory_breakdown.map(r => `<tr>
              <td><strong>${r.article}</strong></td>
              <td><span class="badge ${r.finding === 'FAILED' ? 'risk-high' : 'risk-low'}">${r.finding === 'FAILED' ? '❌ FAILED' : '✅ PASSED'}</span></td>
              <td>${r.impact}</td>
              <td><em>${r.suggested_fix}</em></td>
            </tr>`).join('')}
          </tbody>
        </table>
      ` : ''}

      <p style="margin-top: 40px; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 16px;">
        Generated by Dark Pattern Detector — Automated GDPR/DSA Compliance Auditor
      </p>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 600);
  };

  const downloadPNG = async () => {
    const el = reportRef.current;
    if (!el) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `dark_pattern_report_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      // Fallback: open print dialog
      alert('PNG export requires html2canvas. Using PDF fallback...');
      downloadPDF();
    }
  };

  const downloadJSON = () => {
    const json = JSON.stringify(reportData.raw || reportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dark_pattern_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!reportData) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 group-hover:bg-gray-100 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i>
          </div>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Report Content */}
        <div ref={reportRef} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6" id="report-content">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-white"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Compliance Analysis Report</h1>
                  <p className="text-sm text-gray-500">{reportData.url} • {reportData.date}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-file-pdf"></i>
                Download PDF
              </button>
              <button
                onClick={downloadPNG}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-image"></i>
                Download PNG
              </button>
              <button
                onClick={downloadJSON}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-code"></i>
                Download JSON
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl p-6 text-white ${
              reportData.riskLevel === 'High' ? 'bg-gradient-to-br from-red-500 to-red-600' :
              reportData.riskLevel === 'Medium' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
              'bg-gradient-to-br from-green-500 to-green-600'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium opacity-80">Risk Score</span>
                <i className="fas fa-exclamation-triangle opacity-60"></i>
              </div>
              <div className="text-4xl font-bold mb-1">{reportData.riskScore}/100</div>
              <div className="text-sm opacity-80">{reportData.riskLevel} Risk</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium opacity-80">Detected Patterns</span>
                <i className="fas fa-search opacity-60"></i>
              </div>
              <div className="text-4xl font-bold mb-1">{reportData.detectedCount}</div>
              <div className="text-sm opacity-80">Unique instances found</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium opacity-80">Avg Confidence</span>
                <i className="fas fa-chart-line opacity-60"></i>
              </div>
              <div className="text-4xl font-bold mb-1">{reportData.avgConfidence}%</div>
              <div className="text-sm opacity-80">Model certainty</div>
            </div>

            <div className={`rounded-xl p-6 text-white ${
              reportData.trustScore >= 80 ? 'bg-gradient-to-br from-green-500 to-green-600' :
              reportData.trustScore >= 50 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
              'bg-gradient-to-br from-red-500 to-red-600'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium opacity-80">Trust Score</span>
                <i className="fas fa-shield-alt opacity-60"></i>
              </div>
              <div className="text-4xl font-bold mb-1">{reportData.trustScore}/100</div>
              <div className="text-sm opacity-80">{reportData.status}</div>
            </div>
          </div>

          {/* Fusion Model Indicator */}
          {reportData.analysis_stats?.fusion_model_active && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <i className="fas fa-brain text-purple-600"></i>
              <span className="text-sm text-purple-700 font-medium">
                Fusion Model Active — ensemble weight: {Math.round((reportData.analysis_stats.fusion_weight || 0) * 100)}%
              </span>
            </div>
          )}

          {/* Results Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pattern Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Evidence Snippet</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fusion</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">GDPR/DSA Mapping</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommendation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.results.map((result, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPatternClass(result.type)}`}>
                        {result.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <span className="line-clamp-2" title={result.evidence}>"{result.evidence}"</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${result.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{result.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {result.fusion_score != null ? (
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                          {(result.fusion_score * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">{result.gdpr}</span>
                        <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">{result.dsa}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {result.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {reportData.results.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-3xl text-green-600"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Dark Patterns Detected</h3>
              <p className="text-gray-600">Great news! Our analysis didn't find any deceptive design patterns on this page.</p>
            </div>
          )}

          {/* Regulatory Breakdown */}
          {reportData.regulatory_breakdown && reportData.regulatory_breakdown.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-balance-scale text-blue-600"></i>
                Regulatory Compliance Breakdown
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Article</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Impact</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Suggested Fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.regulatory_breakdown.map((reg, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-sm text-gray-900">{reg.article}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            reg.finding === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {reg.finding === 'FAILED' ? '❌ FAILED' : '✅ PASSED'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{reg.impact}</td>
                        <td className="px-6 py-4 text-sm text-green-700 italic">{reg.suggested_fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        {reportData.results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i className="fas fa-lightbulb text-yellow-500"></i>
              General Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review Consent Mechanisms</h4>
                  <p className="text-sm text-gray-600">Ensure cookie banners and consent dialogs provide equal prominence to accept and reject options.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <i className="fas fa-eye text-purple-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Increase Transparency</h4>
                  <p className="text-sm text-gray-600">Clearly disclose all fees, subscriptions, and data processing activities before user commitment.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <i className="fas fa-undo text-green-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Simplify Cancellation</h4>
                  <p className="text-sm text-gray-600">Make subscription cancellation as easy as subscription signup (click-to-cancel principle).</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <i className="fas fa-clock text-orange-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Remove Urgency Tactics</h4>
                  <p className="text-sm text-gray-600">Avoid false scarcity claims or countdown timers that pressure users into hasty decisions.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
