import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getAuthUser } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (getAuthUser()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Load existing users or initialize empty
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('fraudOpsUsers')) || [];
    } catch {
      return [];
    }
  };

  const handleAction = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('PLEASE PROVIDE CREDENTIALS');
      return;
    }

    const users = getUsers();

    if (isCreateMode) {
      // Create Account
      if (users.some(u => u.email === email)) {
        setError('OPERATIVE ID ALREADY REGISTERED');
        return;
      }
      users.push({ email, password });
      localStorage.setItem('fraudOpsUsers', JSON.stringify(users));
      setSuccess('ACCOUNT CREATED. PROCEED TO LOGIN.');
      setIsCreateMode(false);
      setPassword('');
    } else {
      // Login
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        // Save current user for session tracking
        localStorage.setItem('fraudOps_currentPlayer', email);
        navigate('/dashboard');
      } else {
        setError('INVALID ACCESS KEY OR OPERATIVE ID');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono text-sm relative z-0">
      {/* Background glowing effects */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-[-1]">
        <div className="w-[800px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -translate-x-1/2"></div>
      </div>

      {/* Top Bar */}
      <div className="p-6 absolute top-0 left-0 w-full flex justify-between z-10">
        <Link to="/" className="text-primary font-headline font-bold tracking-widest text-lg">FRAUDOPS</Link>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute w-[400px] h-[500px] bg-primary/20 blur-[80px] pointer-events-none"></div>
        
        {/* Login Card */}
        <div className="bg-background/90 w-full max-w-[450px] p-10 flex flex-col gap-6 relative z-10 border border-white/5 shadow-2xl">
          
          <div className="text-center flex flex-col gap-2 mb-4">
            <h1 className="text-white font-headline font-bold text-3xl uppercase tracking-tighter leading-tight">
              {isCreateMode ? 'Register New\nOperative' : 'Enter The Ops\nNetwork'}
            </h1>
            <p className="text-on-surface-muted text-xs tracking-[0.2em] uppercase font-bold mt-2">
              {isCreateMode ? 'Credential Creation' : 'Authentication Required'}
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleAction}>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-muted text-[20px]">alternate_email</span>
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ACCESS_KEY" 
                  className="w-full bg-surface-dim border-none text-white pl-12 pr-4 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs uppercase"
                />
              </div>
            </div>

            {error && <div className="text-primary font-bold text-xs uppercase text-center">{error}</div>}
            {success && <div className="text-tertiary font-bold text-xs uppercase text-center">{success}</div>}

            {!isCreateMode && (
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 border border-border bg-surface-dim checked:bg-primary checked:border-primary transition-colors cursor-pointer" />
                    <span className="material-symbols-outlined text-[16px] text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <span className="text-on-surface-muted text-xs uppercase tracking-wider group-hover:text-white transition-colors">Persistent Link</span>
                </label>
                
                <Link 
                  to="/reset-password" 
                  className="text-tertiary text-xs uppercase tracking-wider font-bold hover:text-white transition-colors cursor-pointer"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-4 mt-6">
              <Button type="submit" variant={isCreateMode ? "secondary" : "primary"} className="w-full py-4 text-sm font-mono font-bold">
                {isCreateMode ? '[ INITIALIZE CREDENTIALS ]' : '[ ENTER OPS ]'}
              </Button>
              
              <Button 
                type="button" 
                onClick={() => {
                  setIsCreateMode(!isCreateMode);
                  setError('');
                  setSuccess('');
                }}
                variant="outlineSecondary" 
                className="w-full py-4 text-sm font-mono font-bold border-secondary/50 text-secondary/80 hover:border-secondary hover:text-secondary"
              >
                {isCreateMode ? '[ CANCEL REGISTRATION ]' : '[ CREATE ACCOUNT ]'}
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
