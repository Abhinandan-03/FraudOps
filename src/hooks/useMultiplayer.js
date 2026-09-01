import { useState, useEffect, useRef, useCallback } from 'react';

const getWsUrl = (roomCode, playerId) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.VITE_API_URL 
    ? new URL(import.meta.env.VITE_API_URL).host 
    : window.location.host;
  return `${protocol}//${host}/ws/room/${roomCode}/${playerId}`;
};

export function useMultiplayer(roomCode, playerId, playerName) {
  const [roomState, setRoomState] = useState(null);
  const [gameStatus, setGameStatus] = useState('LOBBY'); // LOBBY, PLAYING, RESOLVED
  const [currentCase, setCurrentCase] = useState(null);
  const [caseResult, setCaseResult] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const ws = useRef(null);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const connect = () => {
      ws.current = new WebSocket(getWsUrl(roomCode, playerId));

      ws.current.onopen = () => {
        setConnected(true);
        setError(null);
        // Send initial JOIN with name
        ws.current.send(JSON.stringify({
          event: "JOIN",
          data: { name: playerName || playerId }
        }));
      };

      ws.current.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { event: type, data } = payload;
          
          if (type === "ROOM_STATE") {
            setRoomState(data);
            setGameStatus(data.status);
            if (data.current_case) {
              setCurrentCase(data.current_case);
            }
          } else if (type === "GAME_STARTED") {
            setGameStatus("PLAYING");
            setCaseResult(null);
          } else if (type === "NEW_CASE") {
            setGameStatus("PLAYING");
            setCurrentCase(data.current_case);
            setCaseResult(null);
          } else if (type === "PLAYER_SUBMITTED") {
            // Update local state to show player submitted
            setRoomState(prev => {
              if (!prev) return prev;
              const newPlayers = prev.players.map(p => 
                p.id === data.player_id ? { ...p, action: 'SUBMITTED' } : p
              );
              return { ...prev, players: newPlayers };
            });
          } else if (type === "CASE_RESOLVED") {
            setGameStatus("RESOLVED");
            setCaseResult(data);
            // Refresh room state scores based on result
            setRoomState(prev => {
              if (!prev) return prev;
              return { ...prev, players: data.players };
            });
          }
        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.current.onclose = (event) => {
        setConnected(false);
        if (event.code !== 1000) {
          setError("Disconnected from server. Reconnecting...");
          setTimeout(connect, 3000);
        }
      };
      
      ws.current.onerror = (err) => {
        setConnected(false);
        setError("WebSocket error occurred.");
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close(1000);
      }
    };
  }, [roomCode, playerId, playerName]);

  const sendEvent = useCallback((event, data = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ event, data }));
    }
  }, []);

  const setReady = useCallback((ready) => {
    sendEvent("PLAYER_READY", { ready });
  }, [sendEvent]);

  const startGame = useCallback(() => {
    sendEvent("START_GAME");
  }, [sendEvent]);

  const submitDecision = useCallback((action) => {
    sendEvent("SUBMIT_DECISION", { action });
  }, [sendEvent]);

  const nextCase = useCallback(() => {
    sendEvent("NEXT_CASE");
  }, [sendEvent]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      // Send a leave event just in case before closing
      if (ws.current.readyState === WebSocket.OPEN) {
         ws.current.send(JSON.stringify({ event: 'LEAVE' }));
      }
      ws.current.close();
      ws.current = null;
    }
  }, []);

  return {
    roomState,
    gameStatus,
    currentCase,
    caseResult,
    connected,
    error,
    setReady,
    startGame,
    submitDecision,
    nextCase,
    disconnect
  };
}
