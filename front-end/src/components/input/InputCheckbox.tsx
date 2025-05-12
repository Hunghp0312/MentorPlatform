interface InputCheckboxProps {
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({
  label,
  name,
  onChange,
  checked,
}) => {
  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 bg-gray-800 border-gray-700 rounded focus:ring-offset-gray-900 focus:ring-gray-700"
      />
      <label htmlFor={name} className="ml-2 text-sm text-gray-300">
        {label}
      </label>
    </div>
  );
};
export default InputCheckbox;
