import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  name: string;
  type: string;
  value: string | number;
  placeholder?: string;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errorMessage?: string;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  isRequired?: boolean;
  optionList?: Array<{ id: string | number; name: string }>;
}
const InputCustom: React.FC<InputProps> = ({
  className,
  label,
  name,
  type = "text",
  value,
  placeholder = "",
  onChange,
  errorMessage = "",
  icon,
  showPassword = false,
  setShowPassword = () => {},
  isRequired = false,
  optionList = [],
  onBlur,
}) => {
  const inputComponent = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          className={`w-full px-3 py-2 bg-gray-700 border ${
            errorMessage ? "border-red-500" : "border-gray-700"
          } rounded-md text-white focus:outline-none sm:text-sm focus:ring-1 focus:ring-orange-500 ${className}`}
          placeholder={placeholder}
          onBlur={onBlur}
        />
      );
    }
    if (type === "select") {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full max-h-48 overflow-y-auto px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-orange-500 ${className}`}
        >
          {optionList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      );
    }

    return (
      <>
        <input
          id={name}
          name={name}
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`bg-gray-700 focus:outline-none text-gray-100 sm:text-sm rounded-lg block w-full ${
            errorMessage
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-700 focus:ring-orange-500 focus:border-orange-500"
          } ${inputPadding} p-2.5 border ${className} `}
          placeholder={placeholder}
        />
        {type === "password" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`text-gray-500 hover:text-gray-300 focus:outline-none ${className}`}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      </>
    );
  };
  const inputPadding = icon ? "pl-10" : "pl-3";
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-base font-medium text-gray-300 block mb-2"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {inputComponent()}
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
export default InputCustom;
