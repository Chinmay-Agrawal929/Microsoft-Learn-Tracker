const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const quantumElement = `
            {/* Quantum Orb Decoration */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-fuchsia-500/20 dark:bg-fuchsia-500/30 rounded-full blur-3xl animate-quantum-orbit pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-500/20 dark:bg-cyan-500/20 rounded-full blur-3xl animate-wave-interference pointer-events-none" />
            
            <div className="flex flex-wrap items-center gap-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-neutral-900 dark:bg-black text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_10px_rgba(255,0,255,0.2)] animate-pulse">
                <Zap className="w-3 h-3 text-fuchsia-400" />
                <span>Quantum Sync Active</span>
              </div>
`;

app = app.replace(
  /<div className="flex flex-wrap items-center gap-2">/,
  quantumElement
);

fs.writeFileSync('src/App.tsx', app);
