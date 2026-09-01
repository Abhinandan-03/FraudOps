import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface overflow-x-hidden relative">
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
        <div className="text-primary font-headline font-bold italic tracking-widest text-sm text-glitch">FRAUDOPS</div>
        <div className="flex items-center gap-6 text-on-surface-muted">
          <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors text-lg">monitoring</span>
          <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors text-lg">sports_esports</span>
          <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors text-lg">account_balance_wallet</span>
          <div className="w-8 h-8 rounded-full bg-surface-dim border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors flex items-center justify-center">
             <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mt-24 mb-32 gap-12">
          <div className="flex-1 flex flex-col items-start gap-6">
            <div className="text-tertiary font-mono text-[10px] font-bold tracking-[0.2em] uppercase bg-tertiary/10 px-3 py-1 border border-tertiary/30">
              Real-Time Fraud Operations Simulator
            </div>
            
            <h1 className="text-7xl lg:text-8xl font-headline font-black italic tracking-tighter text-glitch text-white">
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
              <Button variant="outlineSecondary" className="font-mono text-sm px-8">
                [ HOW IT WORKS ] <span className="material-symbols-outlined text-sm ml-2">visibility</span>
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-[450px]">
            {/* System Status Card */}
            <div className="bg-background/80 backdrop-blur-md border border-white/5 shadow-2xl p-8 relative overflow-hidden aspect-square flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="text-tertiary font-mono text-xs font-bold tracking-[0.1em] uppercase">SYS.STATUS: <span className="text-primary">CRITICAL</span></div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
                {/* Progress bars */}
                <div className="w-full bg-surface-dim h-2 overflow-hidden">
                  <div className="bg-primary h-full w-[85%] shadow-[0_0_10px_rgba(226,27,35,0.8)]"></div>
                </div>
                <div className="w-[85%] bg-surface-dim h-2 overflow-hidden">
                  <div className="bg-secondary h-full w-[65%] shadow-[0_0_10px_rgba(161,0,255,0.8)]"></div>
                </div>
                <div className="w-[95%] bg-surface-dim h-2 overflow-hidden">
                  <div className="bg-tertiary h-full w-[90%] shadow-[0_0_10px_rgba(0,245,255,0.8)]"></div>
                </div>
              </div>
              
              <div className="flex justify-end mt-auto relative z-10">
                <div className="text-on-surface-muted font-mono text-[10px] tracking-widest">NODE_01 .ACTIVE</div>
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
          <span className="hover:text-white cursor-pointer transition-colors">Session Data</span>
          <span className="hover:text-white cursor-pointer transition-colors">Network Latency</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
        </div>
      </footer>
    </div>
  );
}
