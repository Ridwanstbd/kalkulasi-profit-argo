import Label from "../Input/Label";
import Select from "./Select";

const SelectForm = ({
  label,
  name,
  value,
  onChange,
  options,
  ariaLabel = "Pilih opsi",
  className = "w-full",
  disabled = false,
  error,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        ariaLabel={ariaLabel}
        className={className}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectForm;
