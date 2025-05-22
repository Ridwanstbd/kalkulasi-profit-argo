import { forwardRef } from "react";

const Anchor = forwardRef(
  (
    {
      href,
      children,
      className = "",
      variant = "default",
      size = "md",
      onClick,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "text-gray-700 hover:text-gray-900",
      primary: "bg-gray-900 text-white hover:bg-gray-800",
      secondary: "bg-yellow-500 text-white hover:bg-yellow-600",
      subtle: "text-gray-500 hover:text-gray-700 underline",
      nav: "text-gray-700 hover:text-gray-900 px-2 py-1",
    };

    const sizes = {
      sm: "text-sm px-2 py-1",
      md: "px-4 py-2",
      lg: "text-lg px-6 py-3",
    };

    const baseClasses =
      variant === "primary" || variant === "secondary"
        ? "inline-block rounded-md"
        : "";
    const variantClasses = variants[variant] || variants.default;
    const sizeClasses =
      variant === "primary" || variant === "secondary"
        ? sizes[size] || sizes.md
        : "";

    const combinedClasses =
      `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

    return (
      <a
        ref={ref}
        href={href}
        className={combinedClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Anchor.displayName = "Anchor";

export default Anchor;
