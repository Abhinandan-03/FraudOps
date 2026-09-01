import { useParams, useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../hooks/useMultiplayer';
import MultiplayerLobby from './MultiplayerLobby';
import MultiplayerGame from './MultiplayerGame';
import MultiplayerResult from '../components/MultiplayerResult';

export default function MultiplayerRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const playerId = localStorage.getItem('fraudOps_playerId');
  const playerName = localStorage.getItem('fraudOps_playerName') || playerId;
  
  const mp = useMultiplayer(roomCode, playerId, playerName);

  if (!mp.connected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-white font-mono text-center">
        {mp.error ? (
          <>
            <div className="text-primary font-bold text-xl mb-4 uppercase">Connection Error</div>
            <p className="text-on-surface-muted mb-6">{mp.error}</p>
            <button onClick={() => navigate('/multiplayer')} className="px-6 py-2 bg-surface border border-border hover:border-primary transition-colors">
              RETURN
            </button>
          </>
        ) : (
          <div className="animate-pulse text-secondary tracking-widest uppercase">
            ESTABLISHING SECURE CONNECTION...
          </div>
        )}
      </div>
    );
  }

  if (mp.gameStatus === 'LOBBY') {
    return <MultiplayerLobby mp={mp} roomCode={roomCode} playerId={playerId} />;
  }
  
  if (mp.gameStatus === 'PLAYING') {
    return <MultiplayerGame mp={mp} playerId={playerId} />;
  }

  if (mp.gameStatus === 'RESOLVED') {
    return <MultiplayerResult mp={mp} playerId={playerId} />;
  }

  return null;
}
