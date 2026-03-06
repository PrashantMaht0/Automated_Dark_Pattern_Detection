import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  // Helper function to assign colors based on the Gemini label
  const getColorForLabel = (label) => {
    switch (label) {
      case 'deceptive_element': return 'rgba(255, 0, 0, 0.6)'; // Red for Dark Patterns
      case 'action_button': return 'rgba(0, 255, 0, 0.6)';     // Green for Buttons
      case 'overlay_content': return 'rgba(255, 165, 0, 0.6)'; // Orange for Popups
      case 'text_element': return 'rgba(0, 0, 255, 0.3)';      // Blue for Text
      default: return 'rgba(128, 128, 128, 0.5)';              // Gray fallback
    }
  };

  const handleTest = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setImageUrl(null);
    setExtractedData(null);

    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      const response = await axios.post('http://localhost:5000/api/audit', {
        targetUrl: formattedUrl
      });

      if (response.data.success) {
        const filePath = response.data.screenshot_used;
        const fileName = filePath.split(/[\\/]/).pop(); 
        
        setImageUrl(`http://localhost:5000/exports/${fileName}`);
        setExtractedData(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Error: Make sure Node, Python scraper, and Gemini API are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dark Pattern Extraction Debugger</h1>
      
      <form onSubmit={handleTest} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Enter website URL..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px' }}>
          {loading ? 'Processing Pipeline...' : 'Run Audit Test'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Screenshot & Bounding Box Overlay Column */}
        {imageUrl && (
          <div style={{ flex: '2', border: '1px solid #ccc', padding: '10px' }}>
            <h3>Visual Output:</h3>
            
            {/* The container must be position: relative so the absolute 
              bounding boxes anchor to the image, not the page.
            */}
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <img 
                src={imageUrl} 
                alt="Scraped Result" 
                style={{ width: '100%', display: 'block' }} 
              />
              
              {/* Render the Bounding Boxes */}
              {extractedData && extractedData.map((item, index) => {
                // LayoutLM format: [x1, y1, x2, y2] out of 1000
                const [x1, y1, x2, y2] = item.layout_box;
                
                // Convert 0-1000 scale to CSS percentages
                const leftPercent = (x1 / 1000) * 100;
                const topPercent = (y1 / 1000) * 100;
                const widthPercent = ((x2 - x1) / 1000) * 100;
                const heightPercent = ((y2 - y1) / 1000) * 100;

                return (
                  <div 
                    key={index}
                    title={`${item.label}: "${item.text}"`} // Hover tooltip
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: `${widthPercent}%`,
                      height: `${heightPercent}%`,
                      border: `2px solid ${getColorForLabel(item.label)}`,
                      backgroundColor: getColorForLabel(item.label).replace('0.6', '0.1').replace('0.3', '0.1'), // Lighter fill
                      pointerEvents: 'auto', // Allows the title tooltip to work on hover
                      cursor: 'help'
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Extracted Data JSON Column */}
        {extractedData && (
          <div style={{ flex: '1', border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9' }}>
            <h3>Legend & Data:</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li><span style={{ color: 'red', fontWeight: 'bold' }}>■</span> Deceptive Element</li>
              <li><span style={{ color: 'orange', fontWeight: 'bold' }}>■</span> Overlay Content</li>
              <li><span style={{ color: 'green', fontWeight: 'bold' }}>■</span> Action Button</li>
              <li><span style={{ color: 'blue', fontWeight: 'bold' }}>■</span> Text Element</li>
            </ul>
            <hr />
            <p><strong>Total Elements:</strong> {extractedData.length}</p>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              wordWrap: 'break-word', 
              maxHeight: '700px', 
              overflowY: 'auto',
              fontSize: '11px'
            }}>
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;