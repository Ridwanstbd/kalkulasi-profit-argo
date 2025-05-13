import Label from "../Input/Label";
import Select2 from "./Select2";

const Select2Form = ({
  id,
  name,
  label,
  labelStyle,
  labelClassName = "",
  error,
  helpText,
  required = false,
  className = "",
  containerClassName = "w-full",
  disabled = false,
  ...selectProps
}) => {
  const selectId =
    id || `select-${name}-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <Label htmlFor={selectId} style={labelStyle} className={labelClassName}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Select2
        id={selectId}
        name={name}
        className={`${error ? "border-red-500" : ""} ${className}`}
        disabled={disabled}
        {...selectProps}
      />

      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
export default Select2Form;
