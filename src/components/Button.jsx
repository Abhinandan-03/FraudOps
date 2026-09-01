export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = "px-6 py-3 uppercase tracking-wider font-bold transition-all active:scale-95 flex items-center justify-center space-x-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10",
    outlineSecondary: "bg-transparent border border-secondary text-secondary hover:bg-secondary/10",
    ghost: "bg-transparent text-white hover:bg-white/5",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
