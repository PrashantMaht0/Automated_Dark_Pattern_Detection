import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const patternClasses = {
  'Deceptive UI Element': 'bg-red-100 text-red-800',

  'Deceptive Snugness': 'bg-red-100 text-red-800',
  'Look Over There': 'bg-orange-100 text-orange-800',
  'Emotional Steering / Confirmshaming': 'bg-purple-100 text-purple-800',
  'Hidden in Plain Sight': 'bg-yellow-100 text-yellow-800',
  'Misleading Information': 'bg-pink-100 text-pink-800',
  'Too Many Options': 'bg-blue-100 text-blue-800',
  'Ambiguous Wording or Information': 'bg-indigo-100 text-indigo-800'
};

export default function Report() {
  const [reportData, setReportData] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which row is hovered!
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

  // --- PDF & Export Functions Kept Exactly the Same ---
  const downloadPDF = () => {
    const content = reportRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Dark Pattern Compliance Report</title><style>body{padding:40px;font-family:sans-serif;}table{width:100%;border-collapse:collapse;margin:16px 0;}th,td{border:1px solid #ddd;padding:12px;text-align:left;}</style></head><body><h1>Report for ${reportData.url}</h1><script>window.print();</script></body></html>`);
    printWindow.document.close();
  };

  const downloadPNG = async () => { /* Kept same */ };
  const downloadJSON = () => { /* Kept same */ };

  if (!reportData) return null;

  // Attempt to get the image from the raw backend data. (Adjust 'screenshot_url' to match your scraper's actual output key)
  // Look at the added `.raw?.raw` !
  const screenshotSrc = reportData.raw?.raw?.screenshot_url || reportData.raw?.screenshot_url || reportData.raw?.imagePath || "https://via.placeholder.com/800x600?text=Screenshot+Not+Available";

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
            {/* Export Buttons... */}
            <div className="mt-4 md:mt-0 flex gap-3">
              <button onClick={downloadPDF} className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-2"><i className="fas fa-file-pdf"></i> Download PDF</button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl p-6 text-white ${reportData.riskLevel === 'High' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'}`}>
              <div className="text-4xl font-bold mb-1">{reportData.riskScore}/100</div>
              <div className="text-sm opacity-80">{reportData.riskLevel} Risk</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-1">{reportData.detectedCount}</div>
              <div className="text-sm opacity-80">Patterns Detected</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-1">{reportData.avgConfidence}%</div>
              <div className="text-sm opacity-80">AI Confidence</div>
            </div>
            <div className={`rounded-xl p-6 text-white ${reportData.trustScore >= 80 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
              <div className="text-4xl font-bold mb-1">{reportData.trustScore}/100</div>
              <div className="text-sm opacity-80">{reportData.status}</div>
            </div>
          </div>

          {/* --- NEW VISUAL AUDIT SECTION (Always Visible) --- */}
          <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden bg-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-desktop text-blue-600"></i>
              Visual Audit Map
            </h3>
            
            <div className="relative mx-auto border border-gray-300 shadow-md bg-white" style={{ maxWidth: '800px' }}>
              {/* The Base Screenshot */}
              <img 
                src={screenshotSrc} 
                alt="Scraped UI" 
                className="w-full h-auto block"
              />

              {/* The Overlay Bounding Boxes (Will safely render nothing if results is empty) */}
              {reportData.results && reportData.results.map((result, i) => {
                if (!result.coordinates) return null;
                
                const { x_min, y_min, x_max, y_max } = result.coordinates;
                const left = (x_min / 10).toFixed(2) + '%';
                const top = (y_min / 10).toFixed(2) + '%';
                const width = ((x_max - x_min) / 10).toFixed(2) + '%';
                const height = ((y_max - y_min) / 10).toFixed(2) + '%';
                
                const isHovered = hoveredIndex === i;

                return (
                  <div
                    key={i}
                    className="absolute border-2 border-red-500 bg-red-500 flex items-start justify-start cursor-crosshair transition-all duration-200"
                    style={{
                      left, top, width, height,
                      backgroundColor: isHovered ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.1)',
                      zIndex: isHovered ? 10 : 1,
                      boxShadow: isHovered ? '0 0 10px rgba(239, 68, 68, 0.8)' : 'none'
                    }}
                    title={result.evidence}
                  >
                    <span className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-1 rounded whitespace-nowrap shadow">
                      {result.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* --- END VISUAL AUDIT SECTION --- */}

          {/* Results Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pattern Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Evidence Snippet</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommendation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.results.map((result, i) => (
                  <tr 
                    key={i} 
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPatternClass(result.type)}`}>
                        {result.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <span className="font-mono bg-gray-100 px-1 rounded">"{result.evidence}"</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-600">{result.probability}%</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {result.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}