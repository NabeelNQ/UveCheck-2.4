import React from 'react';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, id, options, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-gray-700 font-semibold text-sm tracking-wide mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          {...props}
          className="w-full appearance-none px-1 py-2 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-black transition-colors text-black"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectInput;