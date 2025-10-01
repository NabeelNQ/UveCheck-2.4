
import React from 'react';

interface RadioInputProps {
  label: string;
  name: string;
  value: boolean | undefined | null;
  onChange: (value: boolean) => void;
  options: { label: string; value: boolean }[];
}

const RadioInput: React.FC<RadioInputProps> = ({ label, name, value, onChange, options }) => {
  return (
    <div>
      <p className="block text-gray-700 font-semibold text-sm tracking-wide mb-3">{label}</p>
      <div className="flex items-center space-x-6">
        {options.map(option => (
          <label key={option.label} className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative flex items-center">
                <input
                  type="radio"
                  name={name}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  className="absolute opacity-0 w-5 h-5"
                />
                <div className={`w-5 h-5 border-2 rounded-full transition-colors duration-200 flex-shrink-0
                    ${value === option.value ? 'bg-black border-black' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}
                >
                </div>
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-transform duration-200
                    ${value === option.value ? 'scale-100 bg-white' : 'scale-0'}`}
                ></div>
            </div>
            <span className="text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioInput;
