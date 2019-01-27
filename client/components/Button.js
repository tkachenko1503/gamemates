import React from "react";
import "./Button.css";

const Button = ({ children, className, ...props }) => (
  <button {...props} className={`button ${className}`}>
    {children}
  </button>
);

export default Button;
