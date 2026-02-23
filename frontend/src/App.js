import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');

  const handleTest = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setImageUrl(null);

    try {
      // Add https:// if the user forgets it
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      const response = await axios.post('http://localhost:5000/api/test-scraper', {
        targetUrl: formattedUrl
      });

      if (response.data.success) {
        setImageUrl(response.data.imageUrl);
      }
    } catch (err) {
      console.error(err);
      setError('Error: Make sure Node backend and Python scraper are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Backend Pipeline Tester</h1>
      
      <form onSubmit={handleTest} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Enter website URL..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px' }}>
          {loading ? 'Scraping...' : 'Test Scraper'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageUrl && (
        <div style={{ border: '1px solid #ccc', padding: '10px', maxWidth: '800px' }}>
          <h3>Success! Screenshot received:</h3>
          <img 
            src={imageUrl} 
            alt="Scraped Result" 
            style={{ width: '100%', height: 'auto' }} 
          />
        </div>
      )}
    </div>
  );
}

export default App;