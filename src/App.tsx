import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import IntroPage from './components/IntroPage';
import CalculatorPage from './components/CalculatorPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'intro' | 'calculator'>('intro');

  useEffect(() => {
    // Dynamically load Vercel Insights at runtime to avoid Vite bundling issues
    const s = document.createElement('script');
    s.defer = true;
    s.async = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);

    return () => {
      // cleanup if component unmounts
      if (s.parentNode) s.parentNode.removeChild(s);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-lato text-gray-800">
      {currentPage === 'intro' ? (
        <IntroPage onStart={() => setCurrentPage('calculator')} />
      ) : (
        <CalculatorPage />
      )}
      <Analytics />
    </div>
  );
};

export default App;
