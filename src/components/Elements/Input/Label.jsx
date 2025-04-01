const Label = (props) => {
  const { htmlFor, children, style = "mb-2" } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-slate-700 text-sm font-bold ${style}`}
    >
      {children}
    </label>
  );
};
export default Label;
