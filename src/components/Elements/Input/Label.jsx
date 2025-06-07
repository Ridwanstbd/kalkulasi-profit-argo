const Label = (props) => {
  const { htmlFor, children, style = "mb-2", color = "text-slate-700" } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={`block ${color} text-sm font-bold ${style}`}
    >
      {children}
    </label>
  );
};
export default Label;
