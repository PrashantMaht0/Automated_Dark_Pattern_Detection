import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import HowItWorks from './HowItWorks';
import Regulations from './Regulations';
import About from './About';
import Report from './Report';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <Navbar />
        <main className="flex-1">
          <div className="animate-fade-in">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/regulations" element={<Regulations />} />
              <Route path="/about" element={<About />} />
              <Route path="/report" element={<Report />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;