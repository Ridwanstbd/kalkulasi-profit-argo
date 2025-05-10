const Header = (props) => {
  const { children } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
      {children}
    </div>
  );
};
export default Header;
