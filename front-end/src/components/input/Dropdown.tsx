import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
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
  haveOptionAll?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder = "Select an option",
  errorMessage = null,
  inputPadding = "p-2.5",
  className = "",
  label,
  isRequired = false,
  haveOptionAll = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);
  const [typedChars, setTypedChars] = useState("");
  const typeaheadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleOptions = haveOptionAll
    ? options
    : options.filter((opt) => opt.value !== "");
  const selectedOption = visibleOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add effect for scrolling when using keyboard navigation
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownListRef.current) {
      const highlightedElement = dropdownListRef.current.children[
        highlightedIndex
      ] as HTMLElement;

      if (highlightedElement) {
        // Get the dropdown and highlighted element's dimensions
        const dropdownRect = dropdownListRef.current.getBoundingClientRect();
        const highlightedRect = highlightedElement.getBoundingClientRect();

        // Check if the highlighted element is not fully visible
        const isAboveViewport = highlightedRect.top < dropdownRect.top;
        const isBelowViewport = highlightedRect.bottom > dropdownRect.bottom;

        if (isAboveViewport) {
          // Scroll so the highlighted element is at the top
          dropdownListRef.current.scrollTop +=
            highlightedRect.top - dropdownRect.top;
        } else if (isBelowViewport) {
          // Scroll so the highlighted element is at the bottom
          dropdownListRef.current.scrollTop +=
            highlightedRect.bottom - dropdownRect.bottom;
        }
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const isChar = e.key.length === 1 && /\S/.test(e.key);

    if (isChar) {
      const next = typedChars + e.key.toLowerCase();
      setTypedChars(next);

      // reset timer
      if (typeaheadTimeout.current) {
        clearTimeout(typeaheadTimeout.current);
      }

      typeaheadTimeout.current = setTimeout(() => {
        setTypedChars("");
      }, 500);

      const matchIndex = visibleOptions.findIndex((opt) =>
        opt.label.toLowerCase().startsWith(next)
      );

      if (matchIndex !== -1) {
        setHighlightedIndex(matchIndex);
        if (!isOpen) setIsOpen(true);
      }

      return;
    }

    if (
      !isOpen &&
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
    ) {
      setIsOpen(true);
      setHighlightedIndex(0);
      e.preventDefault();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < visibleOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : visibleOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(visibleOptions[highlightedIndex].value, name);
          setIsOpen(false);
          setTypedChars("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        setTypedChars("");
        break;
    }
  };

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
        <div
          tabIndex={0}
          role="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`bg-gray-700 text-left focus:outline-none ${
            selectedOption?.label ? "text-gray-100" : "text-gray-400"
          } sm:text-sm rounded-lg block w-full pr-10 ${
            errorMessage
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-700 focus:ring-orange-500 focus:border-orange-500"
          } ${inputPadding} border cursor-pointer ${className}`}
        >
          {selectedOption?.label || placeholder}
        </div>
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
          tabIndex={-1}
        >
          <ChevronDown
            className={`h-4 w-4 ${
              isOpen ? "rotate-180" : ""
            } transition-transform duration-200`}
          />
        </button>
      </div>

      {isOpen && (
        <ul
          ref={dropdownListRef}
          className="absolute z-10 mt-1 w-full bg-gray-800 max-h-48 overflow-auto rounded-md text-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm"
        >
          {visibleOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value, name);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 ${
                highlightedIndex === index
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-700"
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
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

export default Dropdown;
