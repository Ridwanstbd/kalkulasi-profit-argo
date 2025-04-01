import Input from "./Input";
import Label from "./label";

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
      />
    </div>
  );
};

export default InputForm;
