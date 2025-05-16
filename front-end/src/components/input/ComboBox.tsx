// components/ComboBox.tsx
import React, { useState } from "react";

type ComboBoxOption = {
  name: string;
  id: string | number;
};

type ComboBoxProps = {
  options: ComboBoxOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
};

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.id === value);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-64">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-4 py-2 border rounded bg-white text-left ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {selectedOption?.name || placeholder}
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full border bg-white rounded shadow z-10 max-h-60 overflow-y-auto">
          {searchable && (
            <input
              type="text"
              className="bg-gray-700 focus:outline-none text-gray-100 sm:text-sm rounded-lg block w-full border-gray-700 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer ${
                  option.id === value ? "bg-orange-100" : ""
                }`}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};
