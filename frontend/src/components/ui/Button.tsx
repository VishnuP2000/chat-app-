import React from "react";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

function Button({ title,onClick,type = "button", className = "",}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 ${className}`}
    >
      {title}
    </button>
  );
}

export default Button;