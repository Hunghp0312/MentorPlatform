// components/TagInput.tsx
import React, { useState, KeyboardEvent, ChangeEvent } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const InputTag: React.FC<TagInputProps> = ({
  tags,
  setTags,
  placeholder = "Type and press Enter",
}) => {
  const [input, setInput] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
      e.preventDefault();
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && input === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <input
        className="w-full p-2 border rounded focus:outline-none"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 m-1 rounded"
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
    </div>
  );
};

export default InputTag;
