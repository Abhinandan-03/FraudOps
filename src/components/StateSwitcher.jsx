import { useTheme, THEME_STATES } from '../contexts/ThemeContext';

export default function StateSwitcher() {
  const { appState, setAppState } = useTheme();

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-surface-container border border-outline-variant rounded-md p-4 shadow-xl flex flex-col gap-2 font-label-sm text-on-surface">
      <div className="text-tertiary mb-2 font-bold tracking-widest uppercase">Dev Tools: Theme State</div>
      
      {Object.values(THEME_STATES).map((state) => (
        <button
          key={state}
          onClick={() => setAppState(state)}
          className={`px-3 py-1 text-left border hover:bg-surface-variant transition-colors ${appState === state ? 'border-primary-container bg-primary-container/20 text-primary-fixed' : 'border-outline-variant/30 text-on-surface-variant'}`}
        >
          {state}
        </button>
      ))}
    </div>
  );
}
