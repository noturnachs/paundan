const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
  fullWidth = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm";

  const variantClasses = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md focus:ring-indigo-500",
    secondary:
      "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "opacity-60 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
