import "./button.css";

const Button = ({ className, onClick, children }) => (
  <button className={`button ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
