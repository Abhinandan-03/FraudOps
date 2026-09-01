import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AbortModal from '../components/AbortModal';
import { logoutUser } from '../utils/auth';

export default function MultiplayerEntry() {
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
  const navigate = useNavigate();

  const getPlayerId = () => {
    let id = localStorage.getItem('fraudOps_playerId');
    if (!id) {
      id = 'OP_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      localStorage.setItem('fraudOps_playerId', id);
    }
    return id;
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host_id: getPlayerId() })
      });
      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      navigate(`/multiplayer/${data.room_code}`);
    } catch (err) {
      setError('Network Error: Could not reach multiplayer servers.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    setIsJoining(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/rooms/${roomCode.toUpperCase().trim()}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Room not found');
        throw new Error('Failed to join room');
      }
      navigate(`/multiplayer/${roomCode.toUpperCase().trim()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none wireframe-bg"></div>
      
      <div className="w-full max-w-md bg-surface-dim border border-border p-8 relative z-10 shadow-2xl">
        <h1 className="font-headline font-black text-3xl text-white italic mb-2 tracking-tighter uppercase text-center">
          NETWORK MULTIPLAYER
        </h1>
        <p className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest text-center mb-8">
          Synchronize investigation units.
        </p>

        {error && (
          <div className="bg-primary/20 border border-primary p-3 mb-6 font-mono text-[10px] text-primary uppercase">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || isJoining}
            className="w-full bg-secondary hover:bg-white text-white hover:text-black font-headline font-bold italic text-lg py-4 transition-all uppercase tracking-tight skew-container relative group"
          >
            <span className="unskew-content block">
              {isCreating ? 'ALLOCATING NODE...' : 'HOST NEW SESSION'}
            </span>
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-border"></div>
            <div className="font-mono text-[10px] text-on-surface-muted uppercase">OR JOIN</div>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <div>
              <label className="block font-mono text-[10px] text-on-surface-muted uppercase tracking-widest mb-2">
                SESSION CODE
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ENTER 5-DIGIT CODE"
                maxLength={5}
                className="w-full bg-background border border-border px-4 py-3 text-white font-mono uppercase tracking-widest focus:outline-none focus:border-secondary transition-colors text-center text-xl"
              />
            </div>
            <button
              type="submit"
              disabled={isJoining || isCreating || roomCode.length < 5}
              className="w-full bg-surface border border-border hover:border-secondary text-white font-headline font-bold italic text-lg py-4 transition-all uppercase tracking-tight skew-container disabled:opacity-50"
            >
              <span className="unskew-content block">
                {isJoining ? 'SYNCHRONIZING...' : 'CONNECT'}
              </span>
            </button>
          </form>
          
          <button onClick={() => setIsAbortModalOpen(true)} className="mt-4 font-mono text-[10px] text-on-surface-muted hover:text-white uppercase transition-colors text-center w-full">
            ABORT & RETURN TO DASHBOARD
          </button>
        </div>
      </div>
      
      <AbortModal 
        isOpen={isAbortModalOpen} 
        onCancel={() => setIsAbortModalOpen(false)} 
        onAbort={() => logoutUser(navigate)} 
      />
    </div>
  );
}
