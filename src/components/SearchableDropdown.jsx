import React, { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // sync selected value
  useEffect(() => {
    const selectedOption = options.find(
      (option) => String(option.value) === String(value)
    );

    setInputValue(selectedOption?.label || "");
    setFilteredOptions(options);
  }, [value, options]);

  const handleInputChange = (e) => {
    const text = e.target.value;

    setInputValue(text);

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredOptions(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option.label);

    onChange(option.value);

    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
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
        <ul className="absolute z-10 w-full rounded-xl bg-base-100 shadow-lg max-h-60 overflow-y-auto border border-gray-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={`${option.value}-${option.label}`}
                onClick={() => handleOptionClick(option)}
                className="cursor-pointer p-3 hover:bg-base-200 transition"
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500">
              ไม่พบข้อมูล
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;