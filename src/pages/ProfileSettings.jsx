import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useGame } from '../contexts/GameContext';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import Footer from '../components/Footer';
import AbortModal from '../components/AbortModal';
import { logoutUser, getAuthUser } from '../utils/auth';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { settings, setSettings, defaultSettings } = useSettings();
  const { sessionState, startNewSession } = useGame();

  const [localSettings, setLocalSettings] = useState(settings);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [authEmail, setAuthEmail] = useState(() => getAuthUser() || 'operative@gmail.com');
  
  const [profileForm, setProfileForm] = useState({
    displayName: 'Operative_X',
    username: sessionState?.playerName || 'unknown_op',
    email: getAuthUser() || (sessionState?.playerName ? `${sessionState.playerName.toLowerCase()}@network.io` : 'operative@gmail.com')
  });

  // Track if we need to show unsaved changes warning
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('person');
  const AVAILABLE_AVATARS = ['person', 'robot_2', 'sentiment_satisfied', 'support_agent', 'face_4', 'smart_toy'];

  useEffect(() => {
    // Load local user profile data
    const currentUserEmail = getAuthUser();
    if (currentUserEmail) {
      setAuthEmail(currentUserEmail);
      try {
        const users = JSON.parse(localStorage.getItem('fraudOpsUsers')) || [];
        const user = users.find(u => u.email === currentUserEmail);
        if (user) {
          if (user.username) setSavedUsername(user.username);
          if (user.avatar) setSelectedAvatar(user.avatar);
        }
      } catch (e) {}
    }
  }, []);

  const saveUserProfile = (updates) => {
    const currentUserEmail = getAuthUser();
    if (currentUserEmail) {
      try {
        const users = JSON.parse(localStorage.getItem('fraudOpsUsers')) || [];
        const userIndex = users.findIndex(u => u.email === currentUserEmail);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem('fraudOpsUsers', JSON.stringify(users));
        }
      } catch (e) {}
    }
  };

  const handleSaveUsername = () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setUsernameError('Username cannot be empty.');
      return;
    }
    setSavedUsername(trimmed);
    saveUserProfile({ username: trimmed });
    setEditingUsername(false);
    setUsernameError('');
  };

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
    saveUserProfile({ avatar: avatarId });
    setIsAvatarModalOpen(false);
  };

  useEffect(() => {
    // If settings change from outside, sync them
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationToggle = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const handleSave = () => {
    setSettings(localSettings);
  };

  const handleReset = () => {
    if (window.confirm("Restore all settings to factory defaults?")) {
      setLocalSettings(defaultSettings);
      setSettings(defaultSettings);
    }
  };

  const handleResetGameProgress = () => {
    if (window.confirm("WARNING: This will wipe your current score and streak. Proceed?")) {
      startNewSession({ difficulty: sessionState.difficulty || 'ELITE', playerName: sessionState.playerName });
      alert("Progress Reset.");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("CRITICAL WARNING: This will permanently delete your account and all data. This action CANNOT BE UNDONE. Type 'CONFIRM' to proceed.")) {
      // In a real app we'd verify the prompt input and call API. Here we mock it.
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('fraudOpsUsers')) || [];
      } catch (e) {}
      
      const updatedUsers = users.filter(u => u.email !== sessionState.playerName);
      localStorage.setItem('fraudOpsUsers', JSON.stringify(updatedUsers));
      localStorage.removeItem('fraudOps_currentPlayer');
      navigate('/login');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Passwords do not match.");
      return;
    }
    // Mock backend password update
    alert("Security credentials updated successfully.");
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile metadata updated.");
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col h-screen overflow-hidden">
      
      {/* Top Header */}
      <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-surface-dim relative z-10 shrink-0">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => navigate('/dashboard')}
            className="text-primary font-headline font-bold italic tracking-widest text-xl cursor-pointer"
          >
            FRAUDOPS
          </div>
          <div className="h-6 w-px bg-border"></div>
          <span className="font-mono text-sm tracking-widest uppercase text-white font-bold">Operative Profile & Settings</span>
        </div>
        
        <div className="flex items-center gap-4 text-on-surface-muted">
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 border border-border px-3 py-1 bg-surface cursor-pointer hover:border-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span className="font-mono text-[10px] uppercase font-bold text-white">Return to Ops</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative wireframe-bg pb-32">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          {/* PROFILE HEADER */}
          <section className="bg-surface border border-border p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none"></div>
            
            <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center bg-background shadow-[0_0_15px_rgba(226,27,35,0.4)] flex-shrink-0">
              <span className="material-symbols-outlined text-4xl text-white">{selectedAvatar}</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {savedUsername && !editingUsername ? (
                <>
                  <h2 className="font-headline font-black text-3xl text-white mb-1 uppercase tracking-tight">{savedUsername}</h2>
                  <div className="font-mono text-[10px] text-tertiary mb-4 tracking-widest uppercase cursor-pointer hover:text-white" onClick={() => { setUsernameInput(savedUsername); setEditingUsername(true); }}>
                    [ EDIT USERNAME ]
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <h2 className="font-headline font-bold text-xl text-primary mb-2 uppercase tracking-tight">Choose your username</h2>
                  <div className="flex flex-col sm:flex-row gap-2 max-w-sm">
                    <input 
                      type="text" 
                      value={usernameInput} 
                      onChange={e => setUsernameInput(e.target.value)} 
                      placeholder="Enter your username" 
                      className="bg-background border border-border text-white px-3 py-2 text-xs font-mono focus:border-tertiary outline-none flex-1"
                    />
                    <Button variant="primary" className="text-[10px] px-4 py-2 font-mono uppercase" onClick={handleSaveUsername}>Save</Button>
                  </div>
                  {usernameError && <div className="text-primary font-mono text-[10px] mt-1">{usernameError}</div>}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-on-surface-muted">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider mb-1">Mail ID</span>
                  <span className="text-white">{authEmail || profileForm.email}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider mb-1">Clearance Date</span>
                  <span className="text-white">Oct 14, 2026</span>
                </div>
              </div>
            </div>

            <div className="self-center md:self-start">
              <Button variant="outlineSecondary" className="text-xs uppercase px-4 py-2 font-mono" onClick={() => setIsAvatarModalOpen(true)}>Update Avatar</Button>
            </div>
          </section>

          {/* SETTINGS SECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMN 1 */}
            <div className="flex flex-col gap-8">
              
              {/* APPEARANCE */}
              <section className="bg-surface-dim border border-border p-6 shadow-lg">
                <div className="font-headline font-bold text-sm uppercase tracking-widest text-primary mb-6 border-b border-border pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">palette</span> Appearance
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="font-mono text-xs text-white uppercase mb-2">Interface Theme</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {['miles', 'prowler', 'system'].map(theme => (
                      <button 
                        key={theme}
                        onClick={() => {
                          handleToggle('theme', theme);
                          updateSetting('theme', theme);
                        }}
                        className={`py-2 px-2 border font-mono text-[9px] uppercase font-bold transition-all cursor-pointer ${
                          localSettings.theme === theme 
                            ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(226,27,35,0.4)]' 
                            : 'bg-background border-border text-on-surface-muted hover:border-white/30'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>

                  <div className="font-mono text-xs text-white uppercase mb-2 mt-2">Display Brightness</div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-on-surface-muted text-sm">brightness_low</span>
                    <input 
                      type="range" 
                      min="30" max="100" 
                      value={localSettings.brightness} 
                      onChange={(e) => handleToggle('brightness', parseInt(e.target.value))}
                      className="flex-1 tech-slider accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="material-symbols-outlined text-on-surface-muted text-sm">brightness_high</span>
                    <span className="font-mono text-xs w-8 text-right text-tertiary font-bold">{localSettings.brightness}%</span>
                  </div>

                  <div className="mt-2 border-t border-border pt-4 space-y-1">
                    <Toggle 
                      label="Reduce Motion" 
                      description="Disable heavy CSS animations and transitions."
                      checked={localSettings.reduceMotion}
                      onChange={(val) => handleToggle('reduceMotion', val)}
                    />
                    <Toggle 
                      label="Interface Animations" 
                      description="Show Miles/Prowler success and failure overlays."
                      checked={localSettings.animationsEnabled}
                      onChange={(val) => handleToggle('animationsEnabled', val)}
                    />
                  </div>
                </div>
              </section>

              {/* GAMEPLAY PREFERENCES */}
              <section className="bg-surface-dim border border-border p-6 shadow-lg">
                <div className="font-headline font-bold text-sm uppercase tracking-widest text-secondary mb-6 border-b border-border pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">sports_esports</span> Gameplay Rules
                </div>
                
                <div className="space-y-1">
                  <Toggle 
                    label="Background Music" 
                    description="Continuous ambient soundtrack during active investigation."
                    checked={localSettings.bgMusicEnabled !== false}
                    onChange={(val) => {
                      handleToggle('bgMusicEnabled', val);
                      updateSetting('bgMusicEnabled', val);
                    }}
                  />
                  <Toggle 
                    label="Audio Protocols" 
                    description="Enable sound effects for decisions and alerts."
                    checked={localSettings.soundEnabled}
                    onChange={(val) => {
                      handleToggle('soundEnabled', val);
                      updateSetting('soundEnabled', val);
                    }}
                  />
                  <Toggle 
                    label="Confirm Critical Actions" 
                    description="Require secondary confirmation before FREEZE actions."
                    checked={localSettings.confirmBeforeFreeze}
                    onChange={(val) => handleToggle('confirmBeforeFreeze', val)}
                  />
                  <Toggle 
                    label="Auto-Advance Network" 
                    description="Skip result screen and immediately load next case."
                    checked={localSettings.autoAdvance}
                    onChange={(val) => handleToggle('autoAdvance', val)}
                  />
                </div>
              </section>

            </div>

            {/* COLUMN 2 */}
            <div className="flex flex-col gap-8">
              
              {/* NOTIFICATIONS */}
              <section className="bg-surface-dim border border-border p-6 shadow-lg">
                <div className="font-headline font-bold text-sm uppercase tracking-widest text-white mb-6 border-b border-border pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">notifications_active</span> Network Alerts
                </div>
                
                <div className="space-y-1">
                  <Toggle 
                    label="Threat Intel Radar" 
                    description="Receive alerts for massive velocity spikes globally."
                    checked={localSettings.notifications.suspiciousActivity}
                    onChange={(val) => handleNotificationToggle('suspiciousActivity', val)}
                  />
                  <Toggle 
                    label="Leaderboard Shifts" 
                    description="Notify when you are displaced in rankings."
                    checked={localSettings.notifications.leaderboardUpdates}
                    onChange={(val) => handleNotificationToggle('leaderboardUpdates', val)}
                  />
                  <Toggle 
                    label="Achievement Unlocks" 
                    description="Popup alerts for streaks and milestones."
                    checked={localSettings.notifications.achievements}
                    onChange={(val) => handleNotificationToggle('achievements', val)}
                  />
                </div>
              </section>

              {/* LOGOUT */}
              <section className="bg-surface-dim border border-border p-6 shadow-lg">
                <div className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-muted mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">logout</span> Session Management
                </div>
                <button 
                  onClick={() => setIsAbortModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-background border border-border hover:border-primary group transition-colors shadow-sm"
                >
                  <span className="font-headline font-bold text-sm uppercase text-on-surface-muted group-hover:text-white transition-colors">Terminate Current Session (Log Out)</span>
                  <span className="material-symbols-outlined text-lg text-on-surface-muted group-hover:text-primary transition-colors">exit_to_app</span>
                </button>
              </section>

            </div>
          </div>

          {/* DANGER ZONE */}
          <section className="bg-primary/5 border border-primary p-6 shadow-[0_0_20px_rgba(226,27,35,0.1)] mb-10">
            <div className="font-headline font-black text-xl uppercase tracking-widest text-primary mb-6 border-b border-primary/30 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span> DANGER ZONE
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleResetGameProgress}
                className="flex-1 p-4 bg-background border border-primary hover:bg-primary/10 transition-colors text-left flex flex-col gap-2"
              >
                <span className="font-headline font-bold text-white uppercase tracking-wider text-sm">Wipe Operative Record</span>
                <span className="font-mono text-[10px] text-on-surface-muted leading-relaxed">Erases current streak, score, and operational history. Leaves account and settings intact.</span>
              </button>

              <button 
                onClick={handleDeleteAccount}
                className="flex-1 p-4 bg-primary hover:bg-primary/90 transition-colors text-left flex flex-col gap-2 shadow-[0_0_15px_rgba(226,27,35,0.4)]"
              >
                <span className="font-headline font-black text-white uppercase tracking-wider text-sm">Decommission Account</span>
                <span className="font-mono text-[10px] text-white/80 leading-relaxed">Permanently purge all identity data, settings, and scores from the network. Cannot be undone.</span>
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-secondary/20 border border-secondary p-4 backdrop-blur-md z-40 flex items-center justify-between shadow-[0_0_30px_rgba(161,0,255,0.3)] animate-[slideUp_0.3s_ease-out]">
          <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">Unsaved configuration changes detected.</span>
          <div className="flex gap-4">
            <Button variant="outlineSecondary" onClick={() => setLocalSettings(settings)} className="text-[10px] px-4 py-2 uppercase font-mono border-white/20 text-white/70 hover:text-white">Discard</Button>
            <Button variant="primary" onClick={handleSave} className="text-[10px] px-6 py-2 uppercase font-mono font-bold tracking-widest bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_10px_rgba(161,0,255,0.4)]">Apply Updates</Button>
          </div>
        </div>
      )}

      {/* Global Bottom Footer */}
      <Footer />
      
      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border w-full max-w-md shadow-2xl p-6 relative">
            <h2 className="font-headline font-bold text-xl uppercase tracking-widest text-white mb-6 border-b border-border pb-2 text-center">Select Avatar</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {AVAILABLE_AVATARS.map(avatar => (
                <div 
                  key={avatar} 
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`aspect-square flex items-center justify-center border-2 cursor-pointer transition-all ${
                    selectedAvatar === avatar ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(226,27,35,0.4)]' : 'border-border bg-background hover:border-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl text-white">{avatar}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outlineSecondary" className="text-xs uppercase px-8 py-2 font-mono" onClick={() => setIsAvatarModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <AbortModal 
        isOpen={isAbortModalOpen} 
        onCancel={() => setIsAbortModalOpen(false)} 
        onAbort={() => logoutUser(navigate)} 
      />
    </div>
  );
}
