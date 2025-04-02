import Input from "./Input";
import Label from "./Label";

const InputForm = (props) => {
  const {
    label,
    name,
    type,
    placeholder,
    value,
    onChange,
    checked,
    autoComplete,
    required = false,
    error = null,
  } = props;
  return (
    <div className="mb-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        checked={checked}
        autoComplete={autoComplete}
        required={required}
        error={error}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputForm;
