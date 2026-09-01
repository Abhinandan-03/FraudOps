import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);

  const renderModal = () => {
    if (!activeModal) return null;
    
    let title = "";
    let content = null;
    
    switch(activeModal) {
      case 'rules':
        title = "HOW IT WORKS";
        content = (
          <div className="space-y-4 text-sm text-on-surface-muted leading-relaxed">
            <p><strong className="text-white">OBJECTIVE:</strong> You are a FraudOps operative. Your mission is to analyze incoming transaction streams and identify malicious activity before it affects the network.</p>
            <p><strong className="text-white">ACTIONS:</strong></p>
            <ul className="list-disc pl-5 space-y-3">
              <li><span className="text-primary font-bold px-2 py-0.5 bg-primary/10 border border-primary/30 mr-2">FREEZE</span> Total account lockdown. Use for high-confidence threats (e.g., botnets, synthetic identity rings).</li>
              <li><span className="text-secondary font-bold px-2 py-0.5 bg-secondary/10 border border-secondary/30 mr-2">STEP-UP AUTH</span> Trigger multi-factor challenge. Use for anomalous but potentially legitimate activity (e.g., new device, travel).</li>
              <li><span className="text-tertiary font-bold px-2 py-0.5 bg-tertiary/10 border border-tertiary/30 mr-2">CLEAR</span> Allow transaction. Use for verified false positives or baseline recurring transfers.</li>
              <li><span className="text-primary font-bold px-2 py-0.5 bg-primary/10 border border-primary/30 mr-2">ESCALATE</span> Send to L3 FinCEN unit. Use for complex multi-hop laundering and structuring.</li>
            </ul>
            <p className="pt-2"><strong className="text-white">SCORING:</strong> Correct decisions award <span className="text-tertiary font-bold">+100 points</span> and build your streak. Incorrect decisions deduct <span className="text-primary font-bold">-150 points</span> and break your streak.</p>
          </div>
        );
        break;
      case 'session':
        title = "SESSION DATA";
        content = <p className="text-sm text-on-surface-muted leading-relaxed">No active session found. Please enter the operations dashboard to initialize a new tracking session.</p>;
        break;
      case 'network':
        title = "NETWORK LATENCY";
        // Simulate dynamic pings based on current time to make it look alive, picking a "local" server
        const nowMs = Date.now();
        const basePing = (nowMs % 20) + 8; // Random ping between 8 and 27
        const server2Ping = (nowMs % 40) + 60; // 60-100
        const server3Ping = (nowMs % 100) + 120; // 120-220
        
        content = (
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-on-surface-muted flex items-center gap-2"><span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span> ASIA-SOUTH-1 (LOCAL)</span>
              <span className="text-tertiary font-bold">{basePing}ms</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-on-surface-muted flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> US-EAST-1</span>
              <span className="text-white font-bold">{server3Ping}ms</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-on-surface-muted flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> EU-WEST-1</span>
              <span className="text-white font-bold">{server2Ping}ms</span>
            </div>
            <div className="mt-6 pt-2 text-xs text-tertiary font-bold animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full"></span> CONNECTED TO OPTIMAL NODE
            </div>
          </div>
        );
        break;
      case 'privacy':
        title = "PRIVACY PROTOCOL";
        content = <p className="text-sm text-on-surface-muted leading-relaxed">All operative metrics are end-to-end encrypted. FraudOps adheres strictly to global data protection regulations. Unauthorized access to the ops portal is strictly prohibited and logged by our internal security mainframe.</p>;
        break;
      default:
        return null;
    }
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-surface border border-border w-full max-w-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="font-headline font-bold text-2xl tracking-widest uppercase text-white">{title}</h2>
              <button onClick={() => setActiveModal(null)} className="text-on-surface-muted hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {content}
            <div className="mt-8 flex justify-end">
              <Button variant="outlineSecondary" onClick={() => setActiveModal(null)} className="text-xs px-6 py-2 font-mono uppercase tracking-widest">ACKNOWLEDGE</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface overflow-x-hidden relative">
      {renderModal()}

      {/* Background Texture for Hero */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden opacity-20 pointer-events-none z-0">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-8 p-8 opacity-30 transform scale-150">
          {Array.from({length: 9}).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center grayscale opacity-50">
              <div className="w-32 h-20 bg-surface border border-border"></div>
              <div className="text-[10px] text-primary mt-2">CYBER-RESILIENT FRAUD DEFENSE</div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
      </div>

      {/* Nav */}
      <nav className="p-6 flex justify-between items-center relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-primary font-headline font-bold italic tracking-widest text-sm">FRAUDOPS</div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mt-24 mb-32 gap-12">
          <div className="flex-1 flex flex-col items-start gap-6">
            <div className="text-tertiary font-mono text-[10px] font-bold tracking-[0.2em] uppercase bg-tertiary/10 px-3 py-1 border border-tertiary/30">
              Real-Time Fraud Operations Simulator
            </div>
            
            <h1 className="text-7xl lg:text-8xl font-headline font-black italic tracking-tighter text-white">
              FRAUDOPS
            </h1>
            
            <div className="flex items-center gap-4 border-l-4 border-primary pl-6 py-2">
              <p className="text-xl md:text-2xl font-headline font-bold text-white tracking-wide">
                Detect. Explain. Respond. Measure.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <Link to="/login">
                <Button variant="primary" className="font-mono text-sm px-8">
                  [ ENTER THE OPS ] <span className="material-symbols-outlined text-sm ml-2">open_in_new</span>
                </Button>
              </Link>
              <Button onClick={() => setActiveModal('rules')} variant="outlineSecondary" className="font-mono text-sm px-8">
                [ HOW IT WORKS ] <span className="material-symbols-outlined text-sm ml-2">visibility</span>
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-[450px]">
            {/* Threat Intelligence Radar */}
            <div className="bg-background/80 backdrop-blur-md border border-primary/20 shadow-[0_0_40px_rgba(226,27,35,0.15)] p-8 relative overflow-hidden aspect-square flex flex-col group hover:border-primary/50 transition-all duration-500">
              {/* Animated scanning background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,27,35,0.05)_0%,transparent_70%)] opacity-50"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(226,27,35,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-tertiary font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-1">GLOBAL THREAT MAP</div>
                  <div className="text-primary font-headline font-black italic tracking-widest text-2xl animate-pulse">DEFCON 2</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
              </div>
              
              <div className="flex-1 flex items-center justify-center relative z-10 my-4">
                {/* Radar Circle */}
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/30 relative flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full border border-primary/10 border-dashed animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-6 rounded-full border border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-t border-primary animate-[spin_3s_linear_infinite] shadow-[0_0_15px_#E21B23]"></div>
                  
                  {/* Radar sweep */}
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left bg-gradient-to-br from-primary/40 to-transparent animate-[spin_3s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
                  
                  {/* Blips */}
                  <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#A100FF] animate-pulse"></div>
                  <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_#00F5FF] animate-pulse delay-75"></div>
                  <div className="absolute top-[75%] left-[25%] w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#E21B23] animate-ping"></div>
                  
                  {/* Center Node */}
                  <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#FFF] relative z-20"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 relative z-10 mt-auto border-t border-white/10 pt-4">
                <div>
                  <div className="font-mono text-[8px] text-on-surface-muted tracking-widest uppercase mb-1">ACTIVE THREATS</div>
                  <div className="font-headline font-bold text-lg text-white">14,204</div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-on-surface-muted tracking-widest uppercase mb-1">SYSTEM INTEGRITY</div>
                  <div className="font-headline font-bold text-lg text-secondary">98.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Operations Loop Section */}
      <section className="bg-neutral pt-20 pb-32 border-t border-border relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-1 bg-primary"></div>
            <h2 className="text-3xl font-headline font-bold italic tracking-wider uppercase text-white">THE OPERATIONS LOOP</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {/* Card 1 */}
            <Card skew variant="default" className="border-primary/50 hover:border-primary hover:border-glow-primary transition-all duration-300 min-h-[380px] p-8 flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-headline font-black italic text-surface-dim group-hover:text-primary transition-colors" style={{WebkitTextStroke: "1px rgba(255,255,255,0.1)"}}>01</span>
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">troubleshoot</span>
                </div>
              </div>
              <h3 className="text-xl font-headline font-bold uppercase mb-4 text-white">DETECT</h3>
              <p className="text-sm text-on-surface-muted mb-8 leading-relaxed">Identify anomalies in real-time transaction streams with sub-millisecond latency.</p>
              <div className="mt-auto h-24 bg-surface-dim border border-white/5 relative overflow-hidden group-hover:border-tertiary/30 transition-colors">
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
                {/* Abstract graphic representation */}
                <div className="absolute bottom-2 left-2 right-2 h-12 border-b border-l border-tertiary/20">
                   <div className="absolute bottom-0 left-[10%] h-[40%] w-1 bg-tertiary shadow-[0_0_5px_#00F5FF]"></div>
                   <div className="absolute bottom-0 left-[30%] h-[80%] w-1 bg-tertiary shadow-[0_0_5px_#00F5FF]"></div>
                   <div className="absolute bottom-0 left-[50%] h-[20%] w-1 bg-tertiary shadow-[0_0_5px_#00F5FF]"></div>
                   <div className="absolute bottom-0 left-[70%] h-[100%] w-1 bg-primary shadow-[0_0_5px_#E21B23]"></div>
                </div>
              </div>
            </Card>

            {/* Card 2 */}
            <Card skew variant="default" className="border-border hover:border-secondary hover:border-glow-secondary transition-all duration-300 min-h-[380px] p-8 flex flex-col group mt-0 lg:mt-8">
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-headline font-black italic text-surface-dim group-hover:text-secondary transition-colors" style={{WebkitTextStroke: "1px rgba(255,255,255,0.1)"}}>02</span>
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">search_insights</span>
                </div>
              </div>
              <h3 className="text-xl font-headline font-bold uppercase mb-4 text-white">EXPLAIN</h3>
              <p className="text-sm text-on-surface-muted mb-8 leading-relaxed">Unpack complex algorithmic decisions into human-readable narratives.</p>
              <div className="mt-auto h-24 bg-surface-dim border border-white/5 relative overflow-hidden group-hover:border-secondary/30 transition-colors flex items-center justify-center">
                {/* Abstract graphic representation */}
                <div className="w-full px-4 flex items-center justify-between">
                   <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_5px_#A100FF]"></div>
                   <div className="h-[1px] flex-1 bg-secondary/30 mx-2"></div>
                   <div className="w-2 h-2 rounded-full bg-white/50"></div>
                   <div className="h-[1px] flex-1 bg-secondary/30 mx-2"></div>
                   <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_10px_#A100FF]"></div>
                </div>
              </div>
            </Card>

            {/* Card 3 */}
            <Card skew variant="default" className="border-border hover:border-primary hover:border-glow-primary transition-all duration-300 min-h-[380px] p-8 flex flex-col group mt-0 lg:mt-16">
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-headline font-black italic text-surface-dim group-hover:text-primary transition-colors" style={{WebkitTextStroke: "1px rgba(255,255,255,0.1)"}}>03</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">local_fire_department</span>
                </div>
              </div>
              <h3 className="text-xl font-headline font-bold uppercase mb-4 text-white">RESPOND</h3>
              <p className="text-sm text-on-surface-muted mb-8 leading-relaxed">Deploy targeted countermeasures instantly to halt malicious actors.</p>
              <div className="mt-auto h-24 bg-surface-dim border border-white/5 relative overflow-hidden group-hover:border-primary/30 transition-colors flex justify-center items-center">
                 <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
                    <div className="w-8 h-8 bg-primary shadow-[0_0_15px_#E21B23] rounded-full"></div>
                 </div>
              </div>
            </Card>

            {/* Card 4 */}
            <Card skew variant="default" className="border-border hover:border-tertiary hover:border-glow-tertiary transition-all duration-300 min-h-[380px] p-8 flex flex-col group mt-0 lg:mt-24">
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-headline font-black italic text-surface-dim group-hover:text-tertiary transition-colors" style={{WebkitTextStroke: "1px rgba(255,255,255,0.1)"}}>04</span>
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">bar_chart</span>
                </div>
              </div>
              <h3 className="text-xl font-headline font-bold uppercase mb-4 text-white">MEASURE</h3>
              <p className="text-sm text-on-surface-muted mb-8 leading-relaxed">Analyze impact and refine models based on historical countermeasure success.</p>
              <div className="mt-auto h-24 bg-surface-dim border border-white/5 relative overflow-hidden group-hover:border-tertiary/30 transition-colors">
                <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-tertiary/20 to-transparent"></div>
                <svg className="absolute bottom-0 left-0 w-full h-[60%]" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,100 L0,50 L20,70 L40,30 L60,60 L80,20 L100,40 L100,100 Z" fill="rgba(0, 245, 255, 0.1)" stroke="#00F5FF" strokeWidth="2" />
                </svg>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border flex justify-between text-[10px] tracking-[0.2em] font-mono text-on-surface-muted uppercase relative z-10 bg-background">
        <div>FraudOps System V2.4.0</div>
        <div className="flex gap-6">
          <span onClick={() => setActiveModal('session')} className="hover:text-white cursor-pointer transition-colors">Session Data</span>
          <span onClick={() => setActiveModal('network')} className="hover:text-white cursor-pointer transition-colors">Network Latency</span>
          <span onClick={() => setActiveModal('privacy')} className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
        </div>
      </footer>
    </div>
  );
}
