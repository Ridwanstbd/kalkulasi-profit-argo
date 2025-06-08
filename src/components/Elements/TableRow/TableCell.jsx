const TableCell = ({ children, className }) => {
  return (
    <td
      className={`
        px-2 py-2 text-xs
        sm:px-4 sm:py-3 sm:text-sm
        md:px-6 md:py-4 md:text-base
        whitespace-nowrap text-gray-500
        ${className}
      `}
    >
      {children}
    </td>
  );
};
export default TableCell;
