const Button = (props) => {
  const { type, children, style = "bg-black", onClick = null } = props;
  return (
    <button
      onClick={onClick}
      type={type}
      className={`h-10 px-4 font-semibold rounded-md ${style} cursor-pointer`}
    >
      {children}
    </button>
  );
};
export default Button;
