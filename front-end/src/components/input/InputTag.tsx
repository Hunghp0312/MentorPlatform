// components/TagInput.tsx
import React, { useState, KeyboardEvent, ChangeEvent } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
  inputPadding?: string;
  className?: string;
  setErrorMessage?: (message: string) => void;
}

const InputTag: React.FC<TagInputProps> = ({
  tags,
  setTags,
  placeholder = "Type and press Enter",
  label,
  isRequired = false,
  errorMessage = null,
  inputPadding = "p-2.5",
  className = "",
  setErrorMessage = () => {},
}) => {
  const [input, setInput] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
      e.preventDefault();
      const newTag = input.trim();
      const tagsTrimmed = tags.map((tag) => tag.toLowerCase());
      if (tagsTrimmed.includes(newTag.toLowerCase())) {
        setErrorMessage("Tag is existed");
        return;
      }
      if (newTag.length > 50 || newTag.length < 1) {
        setErrorMessage("Tags should be 1-50 characters");
        return;
      }
      setTags([...tags, newTag]);
      setInput("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setErrorMessage("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-base font-medium text-gray-300 block mb-2">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`bg-gray-700 text-left focus:outline-none text-gray-100 sm:text-sm rounded-lg block w-full ${
          errorMessage
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-700 focus:ring-orange-500 focus:border-orange-500"
        } ${inputPadding} border cursor-pointer ${className}`}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center mt-2 gap-x-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-xs flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputTag;
