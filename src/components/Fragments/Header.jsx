const Header = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-2 w-full overflow-x-auto">
    {children}
  </div>
);

export default Header;
