import React, { useState, useMemo } from 'react';
import { Algorithm, FormData, CalculationResult, AlgorithmKey } from '../types';
import { COUNTRIES } from '../constants';
import { getAlgorithm } from '../services/algorithmService';
import { parseDate } from '../services/dateService';
import Form from './Form';
import ResultPage from './ResultPage';

const CalculatorPage: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const algorithm: Algorithm | null = useMemo(() => {
    if (!selectedValue) return null;
    const country = COUNTRIES.find(c => c.value === selectedValue);
    return country ? getAlgorithm(country.algorithmKey) : null;
  }, [selectedValue]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    setFormData({}); // Reset form data when country changes
    setResult(null);
    setShowResult(false);
  };

  const handleFormChange = (field: keyof FormData, value: string | boolean | null) => {
    const newFormData = { ...formData, [field]: value };

    // If date of birth changes, check if diagnosis date is still valid.
    // If not, clear it.
    if (field === 'dateOfBirth' && newFormData.dateOfBirth && newFormData.dateOfDiagnosis) {
      const dob = parseDate(newFormData.dateOfBirth);
      const dod = parseDate(newFormData.dateOfDiagnosis);
      if (dob && dod && dod < dob) {
        newFormData.dateOfDiagnosis = '';
      }
    }
    setFormData(newFormData);
  };

  const isFormComplete = useMemo(() => {
    if (!algorithm) return false;
    return algorithm.questions.every(question => {
      const value = formData[question];
      if (typeof value === 'boolean') return true;
      return value !== undefined && value !== null && value !== '';
    });
  }, [algorithm, formData]);

  const handleCalculate = () => {
    if (algorithm && isFormComplete) {
      const calculationResult = algorithm.calculate(formData as FormData);
      setResult(calculationResult);
      setShowResult(true);
    }
  };
  
  const handleNewCalculation = () => {
    setShowResult(false);
    setResult(null);
    setFormData({});
    setSelectedValue('');
  };

  const handleEdit = () => {
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">UveCheck</h1>
        <p className="text-gray-600 text-lg mt-2">Predict the risk of uveitis in children</p>
      </header>
      
      <main>
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 transition-all duration-500">
          {!showResult ? (
             <Form
                selectedValue={selectedValue}
                algorithm={algorithm}
                formData={formData}
                isFormComplete={isFormComplete}
                onCountryChange={handleCountryChange}
                onFormChange={handleFormChange}
                onCalculate={handleCalculate}
                countries={COUNTRIES}
            />
          ) : (
            result && <ResultPage 
              result={result} 
              inputs={formData} 
              algorithm={algorithm} 
              onNewCalculation={handleNewCalculation}
              onEdit={handleEdit}
            />
          )}
        </div>
      </main>

      <footer className="text-center mt-10 text-gray-500 text-xs max-w-lg mx-auto">
          <p>Disclaimer: This tool is for informational purposes only and does not constitute medical advice. Consult with a qualified healthcare professional for any medical concerns.</p>
      </footer>
    </div>
  );
};

export default CalculatorPage;