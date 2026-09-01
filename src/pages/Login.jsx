import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-mono text-sm relative z-0">
      {/* Background glowing effects */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-[-1]">
        <div className="w-[800px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -translate-x-1/2"></div>
      </div>

      {/* Top Bar */}
      <div className="p-6 absolute top-0 left-0 w-full flex justify-between z-10">
        <div className="text-primary font-headline font-bold italic tracking-widest text-lg text-glitch">FRAUDOPS</div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Glow behind the card */}
        <div className="absolute w-[400px] h-[500px] bg-primary/20 blur-[80px] pointer-events-none"></div>
        
        {/* Login Card */}
        <div className="bg-background/90 w-full max-w-[450px] p-10 flex flex-col gap-6 relative z-10 border border-white/5 shadow-2xl">
          
          <div className="text-center flex flex-col gap-2 mb-4">
            <h1 className="text-white font-headline font-bold text-3xl uppercase tracking-tighter leading-tight">Enter The Ops<br/>Network</h1>
            <p className="text-on-surface-muted text-xs tracking-[0.2em] uppercase font-bold mt-2">Authentication Required</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-muted text-[20px]">alternate_email</span>
                </div>
                <input 
                  type="text" 
                  placeholder="OPERATIVE_ID@NETWORK.IO" 
                  className="w-full bg-surface-dim border-none text-white pl-12 pr-4 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs uppercase"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-muted text-[20px]">lock</span>
                </div>
                <input 
                  type="password" 
                  placeholder="ACCESS_KEY" 
                  className="w-full bg-surface-dim border-none text-white pl-12 pr-4 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border border-border bg-surface-dim checked:bg-primary checked:border-primary transition-colors cursor-pointer" />
                  <span className="material-symbols-outlined text-[16px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <span className="text-on-surface-muted text-xs uppercase tracking-wider group-hover:text-white transition-colors">Persistent Link</span>
              </label>
              
              <button type="button" className="text-tertiary text-xs uppercase tracking-wider font-bold hover:text-white transition-colors">Reset Key?</button>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <Link to="/dashboard" className="w-full">
                <Button variant="primary" className="w-full py-4 text-sm font-mono font-bold">
                  [ ENTER OPS ]
                </Button>
              </Link>
              
              <Button type="button" variant="outlineSecondary" className="w-full py-4 text-sm font-mono font-bold border-secondary/50 text-secondary/80 hover:border-secondary hover:text-secondary">
                [ CREATE ACCOUNT ]
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-6 flex justify-between text-on-surface-muted text-[10px] tracking-[0.2em] font-bold uppercase relative z-10">
        <div>FraudOps System V2.4.0</div>
        <div className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</div>
      </div>
    </div>
  );
}
