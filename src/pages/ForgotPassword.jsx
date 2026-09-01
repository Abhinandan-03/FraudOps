import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import fraudOpsApi from '../services/fraudOpsApi';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const validateEmail = (val) => {
    if (!val || !val.trim()) {
      return "PLEASE ENTER YOUR EMAIL ADDRESS";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val.trim())) {
      return "PLEASE ENTER A VALID EMAIL ADDRESS";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationErr = validateEmail(email);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setLoading(true);
    try {
      const response = await fraudOpsApi.requestPasswordReset(email.trim());
      setSuccessData(response);
    } catch (err) {
      setError(err.message || "FAILED TO TRANSMIT RESET CONDUIT. VERIFY CONNECTION.");
    } finally {
      setLoading(false);
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
      <div className="flex-1 flex items-center justify-center relative p-6">
        <div className="absolute w-[400px] h-[500px] bg-primary/20 blur-[80px] pointer-events-none"></div>
        
        {/* Card */}
        <div className="bg-background/90 w-full max-w-[450px] p-10 flex flex-col gap-6 relative z-10 border border-white/5 shadow-2xl">
          
          <div className="text-center flex flex-col gap-2 mb-2">
            <h1 className="text-white font-headline font-black italic text-3xl uppercase tracking-tighter leading-tight">
              FORGOT PASSWORD
            </h1>
            <p className="text-on-surface-muted text-xs tracking-wider font-mono mt-1">
              Enter the email address associated with your account.
            </p>
          </div>

          {successData ? (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="bg-surface-dim border border-tertiary/40 p-4 text-center">
                <span className="material-symbols-outlined text-tertiary text-3xl mb-2">mark_email_read</span>
                <div className="text-tertiary font-bold text-xs uppercase tracking-widest mb-1">
                  RESET CONDUIT DISPATCHED
                </div>
                <p className="text-on-surface-muted text-[11px] leading-relaxed">
                  A secure single-use recovery link has been generated for <strong className="text-white">{email}</strong>. Valid for 15 minutes.
                </p>
              </div>

              {successData.reset_url && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-on-surface-muted uppercase tracking-widest">
                    Direct Conduit Access (Testing Mode):
                  </span>
                  <button
                    onClick={() => navigate(successData.reset_url)}
                    className="w-full py-3 bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(161,0,255,0.4)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">lock_reset</span>
                    [ OPEN RESET LINK ]
                  </button>
                </div>
              )}

              <Link to="/login" className="w-full">
                <Button variant="outlineSecondary" className="w-full py-3 text-xs font-mono font-bold">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-muted text-[20px]">alternate_email</span>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email" 
                    className="w-full bg-surface-dim border-none text-white pl-12 pr-4 py-4 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-primary font-bold text-xs uppercase text-center border border-primary/30 bg-primary/10 p-2.5">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 mt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="w-full py-4 text-sm font-mono font-bold cursor-pointer"
                >
                  {loading ? '[ DISPATCHING CONDUIT... ]' : '[ SEND RESET LINK ]'}
                </Button>
                
                <Link to="/login" className="w-full text-center">
                  <span className="text-on-surface-muted text-xs uppercase tracking-wider hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Login
                  </span>
                </Link>
              </div>
            </form>
          )}

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
