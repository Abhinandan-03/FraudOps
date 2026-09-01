export default function GlassPanel({ children, className = '' }) {
  return (
    <div className={`glass-panel relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
