import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { calculateNetworkScore } from '../utils/networkScoring';
import Footer from '../components/Footer';

export default function Network() {
  const navigate = useNavigate();
  const { currentCase, sessionState, isLoadingCase, error, advanceToNextCase } = useGame();

  // Interactive state
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Reset node selection and zoom whenever the active case changes
  useEffect(() => {
    setSelectedNode(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [currentCase?.id]);

  // Loading State
  if (isLoadingCase) {
    return (
      <div className="min-h-screen bg-background font-body text-on-surface flex flex-col items-center justify-center p-6 relative wireframe-bg">
        <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="font-headline font-black italic text-2xl uppercase tracking-widest text-white mb-2">
          SCANNING NETWORK TOPOLOGY...
        </div>
        <p className="font-mono text-xs text-on-surface-muted uppercase tracking-widest">
          Resolving distributed entity nodes & telemetry vectors
        </p>
      </div>
    );
  }

  // Error State
  if (error || !currentCase) {
    return (
      <div className="min-h-screen bg-background font-body text-on-surface flex flex-col items-center justify-center p-6 text-center wireframe-bg">
        <div className="w-16 h-16 bg-primary/10 border border-primary flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">wifi_off</span>
        </div>
        <h2 className="font-headline font-black italic text-3xl uppercase tracking-tight text-white mb-2">
          NETWORK TELEMETRY OFFLINE
        </h2>
        <p className="font-mono text-xs text-on-surface-muted max-w-md mb-6 leading-relaxed">
          {error || "Unable to acquire real-time signal conduits for this operative session."}
        </p>
        <button
          onClick={() => advanceToNextCase()}
          className="px-6 py-3 bg-primary text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all cursor-pointer shadow-[0_0_15px_rgba(226,27,35,0.4)]"
        >
          RECONNECT TELEMETRY
        </button>
      </div>
    );
  }

  const { entityGraph, transactionEvidence = [], detectionSignals = [], threatLevel = "ELEVATED" } = currentCase;
  const nodes = entityGraph?.nodes || [];
  const edges = entityGraph?.edges || [];

  // Authoritative Network Score
  const networkScore = currentCase.networkScore !== undefined
    ? currentCase.networkScore
    : calculateNetworkScore(entityGraph);

  // Derive node metadata dynamically from real graph data
  const getNodeDetails = (node) => {
    if (!node) return null;
    const id = String(node.id || "").toUpperCase();
    
    let type = "CONNECTED ENTITY";
    if (id === "TARGET" || id.includes("TARGET") || id.includes("HUB")) {
      type = "PRIMARY TARGET";
    } else if (id.includes("ACT") || id.includes("SHELL") || id.includes("ACCOUNT")) {
      type = "LINKED ACCOUNT";
    } else if (id.includes("DEV") || id.includes("SAFARI") || id.includes("CHROME") || id.includes("MAC")) {
      type = "DEVICE ENDPOINT";
    } else if (id.includes("IP") || id.includes("VPN") || id.includes("PROXY") || id.includes("TOR")) {
      type = "NETWORK / PROXY CONDUIT";
    } else if (id.includes("PAYROLL") || id.includes("CORP")) {
      type = "ENTERPRISE BATCH HUB";
    }

    // Find connected edges
    const connectedEdges = edges.filter(e => {
      const matchFrom = e.from && e.from[0] === node.x && e.from[1] === node.y;
      const matchTo = e.to && e.to[0] === node.x && e.to[1] === node.y;
      return matchFrom || matchTo;
    });

    const hasSuspiciousEdge = connectedEdges.some(e => e.dashed);

    return {
      type,
      connections: connectedEdges.length,
      suspicious: hasSuspiciousEdge,
      color: node.color || "#A100FF"
    };
  };

  const selectedDetails = selectedNode ? getNodeDetails(selectedNode) : null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.6));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const suspiciousEdgesCount = edges.filter(e => e.dashed).length;

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col h-screen overflow-hidden">
      
      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-border flex flex-col bg-surface-dim relative z-20">
          <div className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/10 border border-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-xl">share</span>
            </div>
            <div>
              <h2 className="font-headline font-black text-xl tracking-tight uppercase text-white mb-0">NODE_01</h2>
              <div className="font-mono text-[8px] text-tertiary tracking-widest uppercase">OPERATIONAL</div>
            </div>
          </div>
          
          <nav className="flex-1 flex flex-col mt-4">
            <div 
              onClick={() => navigate('/dashboard')}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              Live Stream
            </div>
            <div 
              onClick={() => navigate('/investigation')}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              Analysis
            </div>
            <div 
              onClick={() => navigate('/leaderboard')}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              Archive
            </div>
            <div className="bg-secondary text-white py-3 px-6 flex items-center gap-4 cursor-pointer font-bold shadow-[0_0_15px_rgba(161,0,255,0.3)]">
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Network
            </div>
          </nav>
          
          <div className="p-6">
            <Link to="/investigation">
              <button className="w-full bg-primary text-white font-headline font-bold uppercase tracking-wider py-3 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(226,27,35,0.4)] border border-primary text-sm cursor-pointer">
                DEPLOY COUNTERMEASURE
              </button>
            </Link>
          </div>
        </aside>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative wireframe-bg">
          
          {/* Top Header */}
          <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background relative z-10">
            <div className="flex items-center gap-12">
              <div 
                onClick={() => navigate('/dashboard')}
                className="text-primary font-headline font-black italic tracking-tighter text-4xl cursor-pointer"
              >
                FRAUDOPS
              </div>
              
              <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-widest uppercase font-bold text-on-surface-muted">
                <span onClick={() => navigate('/dashboard')} className="hover:text-white cursor-pointer transition-colors">DASHBOARD</span>
                <span onClick={() => navigate('/leaderboard')} className="hover:text-white cursor-pointer transition-colors">LEADERBOARD</span>
                <span className="text-white border-b-2 border-primary pb-1 pt-1">NETWORK</span>
                <span onClick={() => navigate('/investigation')} className="hover:text-white cursor-pointer transition-colors">OPERATIONS</span>
              </nav>
            </div>
            
            <div className="flex items-center gap-4 text-on-surface-muted">
              <span onClick={() => navigate('/leaderboard')} className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">show_chart</span>
              <span onClick={() => navigate('/performance-report')} className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">diamond</span>
              <div onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-surface-dim cursor-pointer hover:border-primary">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            </div>
          </header>

          {/* Sub Header / Meta Telemetry */}
          <div className="px-8 py-4 border-b border-border bg-surface-dim flex flex-wrap items-center justify-between gap-4 z-10">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-headline font-black italic text-2xl md:text-3xl text-white uppercase tracking-tighter mb-0">
                  NETWORK TOPOLOGY ANALYSIS
                </h1>
                <span className="bg-primary/20 text-primary border border-primary px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
                  LIVE TELEMETRY
                </span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-muted flex items-center gap-3 mt-1">
                <span>ACTIVE CASE: <span className="text-white font-bold">{currentCase.id}</span></span>
                <span>//</span>
                <span>SESSION: <span className="text-tertiary">{currentCase.sessionId || "8x7F9A2B"}</span></span>
                <span>//</span>
                <span>THREAT LEVEL: <span className="text-secondary font-bold">{threatLevel}</span></span>
              </div>
            </div>

            {/* Authoritative Score Badge */}
            <div className="flex items-center gap-3">
              <div className="bg-surface border border-border px-5 py-2 flex flex-col items-end shadow-xl">
                <span className="font-mono text-[8px] uppercase tracking-widest text-on-surface-muted">Network Risk Index</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-3xl text-white">
                    {networkScore}
                  </span>
                  <span className="font-mono text-xs text-primary font-bold">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid: Interactive Graph + Analysis Telemetry */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] overflow-hidden">
            
            {/* Left Area: Visual Interactive SVG Graph */}
            <div className="relative flex-1 bg-surface-dim border-r border-border overflow-hidden flex flex-col">
              
              {/* Zoom and Pan Floating Toolbar */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-surface/90 border border-border p-1.5 backdrop-blur-md shadow-xl font-mono text-xs">
                <button 
                  onClick={handleZoomIn} 
                  className="w-8 h-8 flex items-center justify-center bg-surface-dim border border-border/80 hover:border-primary text-white cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
                <button 
                  onClick={handleZoomOut} 
                  className="w-8 h-8 flex items-center justify-center bg-surface-dim border border-border/80 hover:border-primary text-white cursor-pointer transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <button 
                  onClick={handleResetZoom} 
                  className="px-2.5 h-8 flex items-center justify-center gap-1 bg-surface-dim border border-border/80 hover:border-secondary text-on-surface-muted hover:text-white cursor-pointer text-[9px] uppercase tracking-widest transition-colors"
                  title="Reset View"
                >
                  <span className="material-symbols-outlined text-xs">fit_screen</span>
                  Reset
                </button>
                <div className="h-4 w-px bg-border mx-1"></div>
                <span className="text-[10px] text-tertiary px-1 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>

              {/* Graph Container */}
              <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden">
                
                {nodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <span className="material-symbols-outlined text-5xl text-on-surface-muted mb-4">hub_off</span>
                    <h3 className="font-headline font-bold text-lg text-white uppercase mb-1">NO NETWORK CONDUITS DETECTED</h3>
                    <p className="font-mono text-xs text-on-surface-muted max-w-sm">
                      This transaction is isolated with zero multi-hop external entity links.
                    </p>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 550 550" className="w-full h-full select-none">
                      {/* Radar sweep background circles */}
                      <circle cx="275" cy="275" r="220" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
                      <circle cx="275" cy="275" r="150" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                      <circle cx="275" cy="275" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 2" />

                      {/* Edges */}
                      {edges.map((edge, i) => {
                        const isDashed = Boolean(edge.dashed);
                        const edgeColor = edge.color || (isDashed ? '#E21B23' : '#00F5FF');
                        return (
                          <g key={`edge-${i}`}>
                            <line 
                              x1={edge.from[0]} 
                              y1={edge.from[1]} 
                              x2={edge.to[0]} 
                              y2={edge.to[1]} 
                              stroke={edgeColor} 
                              strokeWidth={isDashed ? "2.5" : "2"} 
                              strokeDasharray={isDashed ? "5 5" : "none"}
                              strokeOpacity={isDashed ? "0.85" : "0.5"}
                            />
                            {/* Animated data packet indicator */}
                            <circle 
                              cx={(edge.from[0] + edge.to[0]) / 2} 
                              cy={(edge.from[1] + edge.to[1]) / 2} 
                              r="2.5" 
                              fill={edgeColor} 
                              className="animate-ping"
                            />
                          </g>
                        );
                      })}

                      {/* Nodes */}
                      {nodes.map((node, i) => {
                        const isSelected = selectedNode?.id === node.id;
                        const isTarget = node.id === 'TARGET' || String(node.id).includes('TARGET');
                        const nodeColor = node.color || (isTarget ? '#A100FF' : '#E21B23');
                        const radius = node.r || (isTarget ? 16 : 12);

                        return (
                          <g 
                            key={node.id || `node-${i}`} 
                            className="cursor-pointer transition-all duration-200 group"
                            onClick={() => setSelectedNode(node)}
                          >
                            {/* Selection Ping */}
                            {isSelected && (
                              <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={radius + 10} 
                                fill="none" 
                                stroke={nodeColor} 
                                strokeWidth="2" 
                                className="animate-ping opacity-60"
                              />
                            )}

                            {/* Node Outer Ring */}
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={radius + (isSelected ? 4 : 0)} 
                              fill="#131315" 
                              stroke={nodeColor} 
                              strokeWidth={isSelected ? "3.5" : "2.5"} 
                              filter={isTarget || isSelected ? `drop-shadow(0 0 10px ${nodeColor})` : 'none'}
                              className="transition-all"
                            />

                            {/* Node Core Center */}
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={radius / 2.5} 
                              fill={nodeColor} 
                            />

                            {/* Node Label */}
                            <text 
                              x={node.x} 
                              y={node.y + radius + 14} 
                              fill={isSelected ? '#FFFFFF' : nodeColor} 
                              fontSize={isSelected ? "11" : "9"} 
                              fontFamily="JetBrains Mono, monospace" 
                              fontWeight="bold"
                              textAnchor="middle" 
                              className="uppercase tracking-wider select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            >
                              {node.label || node.id}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}
              </div>

              {/* Node Inspection Panel (Floating or Overlay on Click) */}
              {selectedNode && selectedDetails && (
                <div className="absolute bottom-6 left-6 max-w-sm w-full bg-surface/95 border border-primary p-5 shadow-[0_0_30px_rgba(226,27,35,0.25)] backdrop-blur-md z-30 animate-in fade-in duration-200">
                  <div className="flex justify-between items-start mb-3 border-b border-border pb-2">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">NODE INSPECTION</div>
                      <h3 className="font-headline font-black text-xl text-white uppercase">{selectedNode.label || selectedNode.id}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedNode(null)} 
                      className="text-on-surface-muted hover:text-white cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                    <div>
                      <span className="text-on-surface-muted block text-[8px] uppercase">Classification</span>
                      <span className="text-white font-bold">{selectedDetails.type}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-muted block text-[8px] uppercase">Active Conduits</span>
                      <span className="text-tertiary font-bold">{selectedDetails.connections} Edges Linked</span>
                    </div>
                    <div>
                      <span className="text-on-surface-muted block text-[8px] uppercase">Risk Indicator</span>
                      <span className={`font-bold ${selectedDetails.suspicious ? 'text-primary' : 'text-secondary'}`}>
                        {selectedDetails.suspicious ? 'SUSPICIOUS / INFERRED' : 'CONFIRMED DIRECT'}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-muted block text-[8px] uppercase">Topology Coords</span>
                      <span className="text-on-surface-muted">[{selectedNode.x}, {selectedNode.y}]</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Graph Legend */}
              <div className="p-4 border-t border-border bg-surface/40 flex flex-wrap items-center gap-6 font-mono text-[9px] uppercase tracking-widest text-on-surface-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Primary Target
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Suspicious / Shell Actor
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span> Device / Network Conduit
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-primary"></span> Inferred / Proxy Conduit
                </div>
              </div>

            </div>

            {/* Right Telemetry & Investigation Evidence Panel */}
            <div className="bg-surface border-l border-border flex flex-col h-full overflow-y-auto p-6 space-y-6">
              
              {/* Telemetry Summary Block */}
              <div>
                <div className="font-headline font-bold text-xs uppercase tracking-widest text-secondary mb-3 border-b border-border pb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">analytics</span> GRAPH TELEMETRY
                </div>
                
                <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                  <div className="bg-surface-dim border border-border p-3">
                    <span className="text-on-surface-muted block text-[8px] uppercase">Total Entities</span>
                    <span className="text-white font-bold text-lg">{nodes.length}</span>
                  </div>
                  <div className="bg-surface-dim border border-border p-3">
                    <span className="text-on-surface-muted block text-[8px] uppercase">Active Conduits</span>
                    <span className="text-white font-bold text-lg">{edges.length}</span>
                  </div>
                  <div className="bg-surface-dim border border-border p-3">
                    <span className="text-on-surface-muted block text-[8px] uppercase">Anomalous Hops</span>
                    <span className="text-primary font-bold text-lg">{suspiciousEdgesCount}</span>
                  </div>
                  <div className="bg-surface-dim border border-border p-3">
                    <span className="text-on-surface-muted block text-[8px] uppercase">Risk Metric</span>
                    <span className="text-tertiary font-bold text-lg">{networkScore}%</span>
                  </div>
                </div>
              </div>

              {/* Feed Intel Log */}
              {currentCase.feedLog && (
                <div>
                  <div className="font-headline font-bold text-xs uppercase tracking-widest text-tertiary mb-3 border-b border-border pb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">terminal</span> INTEL SUMMARY
                  </div>
                  <div className="bg-surface-dim border border-border p-3 font-mono text-[10px] text-white/90 leading-relaxed">
                    {currentCase.feedLog}
                  </div>
                </div>
              )}

              {/* Transaction Evidence in Current Case */}
              <div>
                <div className="font-headline font-bold text-xs uppercase tracking-widest text-primary mb-3 border-b border-border pb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">receipt_long</span> LINKED TRANSACTIONS
                </div>
                
                <div className="flex flex-col gap-3 font-mono text-[10px]">
                  {transactionEvidence.map((tx, idx) => (
                    <div key={tx.id || idx} className="bg-surface-dim border border-border p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-sm">
                          ${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`font-bold uppercase text-[9px] ${
                          tx.riskColor === 'primary' || tx.risk?.includes('HIGH') ? 'text-primary' : 'text-secondary'
                        }`}>
                          {tx.risk}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-on-surface-muted">
                        <div>IP: <span className="text-white">{tx.ip}</span></div>
                        <div>LOC: <span className="text-white">{tx.loc}</span></div>
                        {tx.dev && <div className="col-span-2 mt-1">DEV: <span className="text-white">{tx.dev}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection Signals */}
              {detectionSignals.length > 0 && (
                <div>
                  <div className="font-headline font-bold text-xs uppercase tracking-widest text-white mb-3 border-b border-border pb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">radar</span> DETECTION SIGNALS
                  </div>
                  <div className="flex flex-col gap-3 font-mono text-[10px]">
                    {detectionSignals.map((sig, idx) => (
                      <div key={sig.id || idx} className="bg-surface-dim border border-border p-3">
                        <div className="flex justify-between items-center mb-1 font-bold">
                          <span className="text-white">{sig.name}</span>
                          <span className={sig.percent >= 80 ? 'text-primary' : 'text-secondary'}>
                            {sig.percent}%
                          </span>
                        </div>
                        <div className="w-full bg-background h-1 mb-1">
                          <div 
                            className={`h-full ${sig.percent >= 80 ? 'bg-primary' : 'bg-secondary'}`}
                            style={{ width: `${sig.percent}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-on-surface-muted leading-tight">{sig.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ops Countermeasure Button */}
              <div className="pt-4">
                <button
                  onClick={() => navigate('/investigation')}
                  className="w-full py-3 bg-primary text-white font-headline font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(226,27,35,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">security</span>
                  TAKE ACTION IN OPS
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
