import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MultiSelectBox = ({ options, onSelectionChange, type, label, label_classname, filters }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null); // Reference for the dropdown

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    let updatedSelections;
    if (selectedOptions.includes(option)) {
      updatedSelections = selectedOptions.filter((item) => item !== option);
    } else {
      updatedSelections = [...selectedOptions, option];
    }

    setSelectedOptions(updatedSelections);
    onSelectionChange(type, updatedSelections);
  };

  const removeOption = (option) => {
    const updatedSelections = selectedOptions.filter((item) => item !== option);
    setSelectedOptions(updatedSelections);
    onSelectionChange(type, updatedSelections);
  };

  const clearAllSelections = () => {
    setSelectedOptions([]);
    onSelectionChange(type, []);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Filter options based on search input
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full py-2" ref={dropdownRef}>
      {/* Label */}
      <p className={`${label_classname}`}>{label} ({options.length})</p>

      {/* Selected options */}
      <div
        onClick={toggleDropdown}
        className="w-full border rounded-lg p-2 flex justify-between gap-3 cursor-pointer"
      >
        <div className="flex flex-wrap gap-2 items-center cursor-pointer">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option, index) => (
              <span
                key={index}
                className="flex items-center bg-gray-400 text-white px-2 py-1 rounded-full text-sm"
              >
                {option}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(option);
                  }}
                  className="ml-2 text-white hover:text-gray-300"
                >
                  &times;
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select options</span>
          )}
        </div>

        { selectedOptions.length > 0 && (
          <button
          onClick={clearAllSelections}
          className="text-base text-red-500"
        >
          &times;
        </button>
        ) }
      </div>

      {/* Dropdown options with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full border rounded-lg bg-white shadow-md mt-1 max-h-60 z-10"
          >
            {/* Search input */}
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-md p-2 text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Options list */}
            <div className="max-h-40 overflow-y-auto select_scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-2 cursor-pointer ${selectedOptions.includes(option)
                        ? "bg-blue-100 text-black"
                        : "hover:bg-gray-100"
                      }`}
                  >
                    {option}
                  </div>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500 text-sm">No options found</p>
              )}
            </div>

            {/* Clear All & Close Buttons
            <div className="flex justify-between p-2 border-t">
              <button
                onClick={clearAllSelections}
                className="text-sm text-red-500 hover:underline"
              >
                Clear All
              </button>
              <button
                onClick={closeDropdown}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelectBox;
