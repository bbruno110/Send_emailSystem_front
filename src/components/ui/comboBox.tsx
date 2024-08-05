import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  value: string;
  onSelect: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  width?: string;
  direction?: 'down' | 'up';
}

const Combobox: React.FC<ComboboxProps> = ({
  value,
  onSelect,
  options,
  placeholder,
  className,
  width,
  direction = 'down'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownZIndex, setDropdownZIndex] = useState<number>(20); // Estado para o z-index
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setDropdownZIndex(10); // Resetar o z-index quando o dropdown é fechado
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const dropdownClasses = `absolute ${direction === 'down' ? 'top-full' : 'bottom-full'} left-0 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 z-${dropdownZIndex}`;

  const arrowClasses = `ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`;

  return (
    <div className={`relative z-10 ${className}`} style={{ width }} ref={comboboxRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border p-1 rounded w-full flex justify-between items-center text-sm mr-6" 
        style={{ height: '2.5rem' }}
      >
        {displayValue}
        <span className={arrowClasses}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className={dropdownClasses}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="block w-full text-left px-4 py-1 hover:bg-gray-200"
              style={{ height: '2.5rem', marginBottom: '0.8rem' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Combobox;
