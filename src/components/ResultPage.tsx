
import React from 'react';
import { CalculationResult, FormData, Algorithm } from '../types';

interface ResultPageProps {
  result: CalculationResult;
  inputs: Partial<FormData>;
  algorithm: Algorithm | null;
  onNewCalculation: () => void;
  onEdit: () => void;
}

const riskStyles: { [key: string]: { border: string; text: string; } } = {
  'High Risk': { border: 'border-red-500', text: 'text-red-600' },
  'Medium Risk': { border: 'border-yellow-500', text: 'text-yellow-600' },
  'Low Risk': { border: 'border-green-500', text: 'text-green-600' },
  'Very Low Risk': { border: 'border-blue-500', text: 'text-blue-600' },
  'Low to Medium Risk': { border: 'border-yellow-500', text: 'text-yellow-600' },
  'No Risk': { border: 'border-gray-400', text: 'text-gray-600' },
  'Error': { border: 'border-gray-400', text: 'text-gray-600' },
};

const questionLabels: Record<string, string> = {
  dateOfBirth: "Patient's Date of Birth",
  dateOfDiagnosis: "Date of Diagnosis of Arthritis",
  subDiagnosis: "Sub-diagnosis of Arthritis",
  anaPositive: "Antinuclear Antibody (ANA)",
  onMethotrexate: "On Methotrexate",
  biologicalTreatment: "Biological Treatment"
};


const ResultPage: React.FC<ResultPageProps> = ({ result, inputs, algorithm, onNewCalculation, onEdit }) => {
  const getDisplayValue = (key: keyof FormData, value: any) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (!value) return 'N/A';
    return value;
  };
  
  const style = riskStyles[result.riskLevel] || riskStyles['No Risk'];

  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-center text-2xl font-bold text-gray-800">Assessment Result</h2>

        <div className={`p-4 rounded-lg border-2 ${style.border}`}>
            <p className="text-center text-sm font-bold text-gray-500 tracking-wider">RISK LEVEL</p>
            <p className={`text-center text-3xl font-bold ${style.text}`}>{result.riskLevel}</p>
        </div>
      
      <div className="space-y-4">
        <ResultCard title="Recommendation" content={result.recommendation} />
        <ResultCard title="Follow Up" content={result.followup} />
        <ResultCard title="Justification" content={result.justification} />
      </div>

      <div>
        <h3 className="text-center text-xl font-bold text-gray-800 mb-4">Input Summary</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <ol className="list-decimal list-inside text-gray-700">
                {algorithm?.questions.map((key) => (
                    <li key={key} className="mb-2">
                        <span className="font-semibold">{questionLabels[key] || key}</span>
                        <p className="pl-6 text-gray-600">{getDisplayValue(key, inputs[key])}</p>
                    </li>
                ))}
            </ol>
        </div>
      </div>
      
      <div className="pt-6 flex flex-col sm:flex-row-reverse gap-4 justify-center">
        <button
          onClick={onNewCalculation}
          className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Start New Assessment
        </button>
        <button
          onClick={onEdit}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Edit Answers & Recalculate
        </button>
      </div>
    </div>
  );
};

const ResultCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <h4 className="font-bold text-gray-800 text-base mb-1">{title}</h4>
    <p className="text-gray-600 text-base">{content || 'N/A'}</p>
  </div>
);

export default ResultPage;
