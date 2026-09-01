import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import fraudOpsApi from '../services/fraudOpsApi';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!email || !email.trim()) {
      setSubmitError("PLEASE ENTER YOUR OPERATIVE ID OR EMAIL.");
      return;
    }

    if (!newPassword || !newPassword.trim()) {
      setSubmitError("NEW PASSWORD CANNOT BE EMPTY.");
      return;
    }

    if (newPassword.length < 4) {
      setSubmitError("PASSWORD MUST BE AT LEAST 4 CHARACTERS.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await fraudOpsApi.resetPassword(email.trim(), newPassword);
      setIsResetSuccessful(true);
    } catch (err) {
      setSubmitError(err.message || "FAILED TO UPDATE CREDENTIALS.");
    } finally {
      setSubmitting(false);
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
          
          {isResetSuccessful ? (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300 text-center">
              <div className="w-16 h-16 bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
              </div>
              <h2 className="text-white font-headline font-black italic text-2xl uppercase tracking-tighter">
                PASSWORD RESET SUCCESSFUL
              </h2>
              <p className="text-on-surface-muted text-xs font-mono">
                Your password has been updated.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                variant="primary" 
                className="w-full py-4 text-xs font-mono font-bold uppercase tracking-widest cursor-pointer mt-2"
              >
                [ RETURN TO LOGIN ]
              </Button>
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="text-center flex flex-col gap-2 mb-2">
                <h1 className="text-white font-headline font-black italic text-3xl uppercase tracking-tighter leading-tight">
                  RESET PASSWORD
                </h1>
                <p className="text-on-surface-muted text-xs font-mono">
                  Enter your operative ID and new access key credentials.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Operative ID / Email */}
                <div>
                  <label className="block text-[10px] text-on-surface-muted uppercase tracking-widest mb-1 font-bold">
                    Operative ID / Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-muted text-[18px]">alternate_email</span>
                    </div>
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (submitError) setSubmitError('');
                      }}
                      placeholder="OPERATIVE_ID@NETWORK.IO" 
                      className="w-full bg-surface-dim border-none text-white pl-12 pr-4 py-3.5 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs uppercase"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-[10px] text-on-surface-muted uppercase tracking-widest mb-1 font-bold">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-muted text-[18px]">lock</span>
                    </div>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (submitError) setSubmitError('');
                      }}
                      placeholder="********" 
                      className="w-full bg-surface-dim border-none text-white pl-12 pr-12 py-3.5 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs uppercase"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-muted hover:text-white cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showNewPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] text-on-surface-muted uppercase tracking-widest mb-1 font-bold">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-muted text-[18px]">lock</span>
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (submitError) setSubmitError('');
                      }}
                      placeholder="********" 
                      className="w-full bg-surface-dim border-none text-white pl-12 pr-12 py-3.5 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow placeholder:text-on-surface-muted/50 font-mono text-xs uppercase"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-muted hover:text-white cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="text-primary font-bold text-xs uppercase text-center border border-primary/30 bg-primary/10 p-2.5">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col gap-4 mt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={submitting}
                  className="w-full py-4 text-sm font-mono font-bold cursor-pointer"
                >
                  {submitting ? '[ UPDATING CREDENTIALS... ]' : '[ RESET PASSWORD ]'}
                </Button>
                
                <Link to="/login" className="w-full text-center">
                  <span className="text-on-surface-muted text-xs uppercase tracking-wider hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Cancel & Return to Login
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
