import React, { useState } from 'react';
import IntroPage from './components/IntroPage';
import CalculatorPage from './components/CalculatorPage';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'intro' | 'calculator'>('intro');

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-lato text-gray-800">
      {currentPage === 'intro' ? (
        <IntroPage onStart={() => setCurrentPage('calculator')} />
      ) : (
        <CalculatorPage />
      )}
    </div>
  );
};

export default App;
