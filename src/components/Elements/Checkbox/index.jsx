import Input from "../Input/Input";
import Label from "../Input/Label";
const Checkbox = (props) => {
  const { name, checked = false, onChange, label } = props;
  return (
    <div className="flex text-center items-center gap-2">
      <Input
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <Label htmlFor={name} style="mb-0.5">
        {label}
      </Label>
    </div>
  );
};
export default Checkbox;
