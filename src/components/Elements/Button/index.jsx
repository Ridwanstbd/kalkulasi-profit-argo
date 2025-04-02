const Button = (props) => {
  const { type, children, className = "bg-black", onClick = null } = props;
  return (
    <button
      onClick={onClick}
      type={type}
      className={`h-10 px-4 font-semibold rounded-md ${className} cursor-pointer`}
    >
      {children}
    </button>
  );
};
export default Button;
