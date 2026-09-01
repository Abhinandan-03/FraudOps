export default function Card({ children, variant = 'default', skew = false, className = '', ...props }) {
  const baseClasses = "relative overflow-hidden";
  
  const variants = {
    default: "bg-surface border border-border",
    primary: "bg-surface border-glow-primary",
    secondary: "bg-surface border-glow-secondary",
    ghost: "bg-transparent",
  };

  const skewClass = skew ? "skew-container" : "";

  return (
    <div className={`${baseClasses} ${variants[variant]} ${skewClass} ${className}`} {...props}>
      {skew ? (
        <div className="unskew-content h-full w-full">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
