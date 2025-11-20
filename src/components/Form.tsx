
import React from 'react';
import { Algorithm, FormData, Country } from '../types';
import DateInput from './DateInput';
import SelectInput from './SelectInput';
import RadioInput from './RadioInput';
import { parseDate, yearsDaysDiff } from '../services/dateService';

interface FormProps {
  selectedValue: string;
  algorithm: Algorithm | null;
  formData: Partial<FormData>;
  isFormComplete: boolean;
  countries: Country[];
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFormChange: (field: keyof FormData, value: string | boolean | null) => void;
  onCalculate: () => void;
}

const Form: React.FC<FormProps> = ({
  selectedValue,
  algorithm,
  formData,
  isFormComplete,
  countries,
  onCountryChange,
  onFormChange,
  onCalculate,
}) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Allow selection of today

  const dobDate = formData.dateOfBirth ? parseDate(formData.dateOfBirth) : null;
  if (dobDate) {
    dobDate.setHours(0, 0, 0, 0); // Start of the day for minDate
  }

  const currentAge = dobDate ? yearsDaysDiff(dobDate, today).years : null;
  const isAgeLimitExceeded = algorithm?.maxAge && currentAge !== null && currentAge > algorithm.maxAge;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <SelectInput
          id="algorithm-select"
          label="Select Guideline"
          value={selectedValue}
          onChange={onCountryChange}
          options={[
            { value: '', label: 'Select an option' },
            ...countries.map(c => ({ value: c.value, label: c.label })),
          ]}
        />
      </div>

      {algorithm && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {algorithm.questions.includes('dateOfBirth') && (
              <DateInput
                label="Date of Birth"
                value={formData.dateOfBirth || ''}
                onChange={(value) => onFormChange('dateOfBirth', value)}
                maxDate={today}
              />
            )}
            {algorithm.questions.includes('dateOfDiagnosis') && (
              <DateInput
                label="Date of Diagnosis"
                value={formData.dateOfDiagnosis || ''}
                onChange={(value) => onFormChange('dateOfDiagnosis', value)}
                minDate={dobDate || undefined}
                maxDate={today}
              />
            )}
          </div>

          {algorithm.questions.includes('subDiagnosis') && (
            <SelectInput
              label="Sub-diagnosis"
              value={formData.subDiagnosis || ''}
              onChange={(e) => onFormChange('subDiagnosis', e.target.value)}
              options={[
                { value: '', label: 'Select an option' },
                ...algorithm.subDiagnosisOptions.map(opt => ({ value: opt, label: opt })),
              ]}
            />
          )}

          {algorithm.questions.includes('anaPositive') && (
            <RadioInput
              label="Antinuclear Antibody (ANA) Positive?"
              name="anaPositive"
              value={formData.anaPositive}
              onChange={(value) => onFormChange('anaPositive', value)}
              options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
            />
          )}

          {algorithm.questions.includes('onMethotrexate') && (
            <RadioInput
              label="On Methotrexate?"
              name="onMethotrexate"
              value={formData.onMethotrexate}
              onChange={(value) => onFormChange('onMethotrexate', value)}
              options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
            />
          )}

          {algorithm.questions.includes('biologicalTreatment') && algorithm.biologicalTreatmentOptions && (
            <SelectInput
              label="Biological Treatment"
              value={formData.biologicalTreatment || ''}
              onChange={(e) => onFormChange('biologicalTreatment', e.target.value)}
              options={[
                { value: '', label: 'Select an option' },
                ...algorithm.biologicalTreatmentOptions.map(opt => ({ value: opt, label: opt })),
              ]}
            />
          )}

          {isAgeLimitExceeded && (
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
               <div className="flex">
                 <div className="flex-shrink-0">
                   <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                 </div>
                 <div className="ml-3">
                   <p className="text-sm text-yellow-700">
                     This is a guideline for patients up to age {algorithm.maxAge}.
                   </p>
                 </div>
               </div>
             </div>
          )}

          <div className="pt-4">
            <button
              onClick={onCalculate}
              disabled={!isFormComplete || isAgeLimitExceeded || false}
              className={`w-full text-base font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                isFormComplete && !isAgeLimitExceeded
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Calculate Risk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
