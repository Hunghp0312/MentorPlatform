import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type ComboBoxProps = {
  options: Option[];
  value: string;
  onChange: (value: string, name: string) => void;
  name: string;
  placeholder?: string;
  errorMessage?: string | null;
  inputPadding?: string;
  className?: string;
  label?: string;
  isRequired?: boolean;
};

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder = "",
  errorMessage = null,
  inputPadding = "p-2.5",
  className = "",
  label,
  isRequired = false,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  // Filter out empty value options
  const visibleOptions = options.filter((opt) => opt.value !== "");

  // Show all options or filtered options based on state
  const displayedOptions = showAllOptions
    ? visibleOptions
    : visibleOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (option: Option) => {
    onChange(option.value, name);
    setQuery(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Update query when value or options change
  useEffect(() => {
    const current = options.find((opt) => opt.value === value);
    setQuery(current ? current.label : "");
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);

        // Reset query if no matching option and no value
        const current = options.find((opt) => opt.value === value);
        if (!current && query.trim()) {
          setQuery("");
          onChange("", name);
        } else if (current && query !== current.label) {
          // Reset query to match the current value if user typed something else
          setQuery(current.label);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options, value, query, name, onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < displayedOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : displayedOptions.length - 1
        );
        break;
      case "Enter":
        if (isOpen && highlightedIndex >= 0 && displayedOptions.length > 0) {
          e.preventDefault();
          handleSelect(displayedOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const toggleDropdown = () => {
    // Toggle dropdown state
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Always show all options when opening with the button
    if (newIsOpen) {
      setShowAllOptions(true);
      // Focus the input when opening
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(0);

    // Only filter when actually typing something
    setShowAllOptions(newQuery === "");
  };
  // Add effect to handle scrolling when using arrow keys
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLElement;

      if (highlightedElement) {
        // Get the dropdown and highlighted element's dimensions
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const highlightedRect = highlightedElement.getBoundingClientRect();

        // Check if the highlighted element is not fully visible
        const isAboveViewport = highlightedRect.top < dropdownRect.top;
        const isBelowViewport = highlightedRect.bottom > dropdownRect.bottom;

        if (isAboveViewport) {
          // Scroll so the highlighted element is at the top
          dropdownRef.current.scrollTop +=
            highlightedRect.top - dropdownRect.top;
        } else if (isBelowViewport) {
          // Scroll so the highlighted element is at the bottom
          dropdownRef.current.scrollTop +=
            highlightedRect.bottom - dropdownRect.bottom;
        }
      }
    }
  }, [highlightedIndex, isOpen]);
  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label
          htmlFor={name}
          className="text-base font-medium text-gray-300 block mb-2"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            // Show all options when focusing on empty input
            setShowAllOptions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`bg-gray-700 focus:outline-none text-gray-100 sm:text-sm rounded-lg block w-full pr-10 ${
            errorMessage
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-700 focus:ring-orange-500 focus:border-orange-500"
          } ${inputPadding} border ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
          onClick={toggleDropdown}
          tabIndex={-1}
        >
          <ChevronDown
            className={`h-4 w-4 ${
              isOpen ? "rotate-180" : ""
            } transition-transform duration-200`}
          />
        </button>
      </div>
      {isOpen && displayedOptions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-gray-800 max-h-60 overflow-auto rounded-md text-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm"
        >
          {displayedOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer px-4 py-2 ${
                index === highlightedIndex
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default ComboBox;
