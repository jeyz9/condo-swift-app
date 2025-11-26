import React, { useState, useEffect, useRef } from 'react';

const SearchableDropdown = ({ options, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
    setFilteredOptions(options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
  }, [value, options]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    setFilteredOptions(options.filter(option => option.toLowerCase().includes(text.toLowerCase())));
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="input input-bordered w-full"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-base-100 shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="p-2 hover:bg-base-300 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
