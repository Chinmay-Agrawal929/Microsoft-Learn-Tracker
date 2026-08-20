const fs = require('fs');

const code = `import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

// Helper for pseudo-random deterministic values
const pseudoRandom = (seed, min, max) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  const normalized = x - Math.floor(x);
  return min + normalized * (max - min);
};

// Individual sand grain component
const SandGrain = React.memo(({ smoothProgress, color, finalX, finalY, seed }) => {
  // Scatter mostly at the bottom
  const startX = pseudoRandom(seed, -600, 600);
  const startY = pseudoRandom(seed + 1000, 300, 1000); // Start below the visible center
  const midX = pseudoRandom(seed + 2000, -300, 300); // Swirling air
  const midY = pseudoRandom(seed + 3000, -200, 200);
  const startRot = pseudoRandom(seed + 4000, -1080, 1080);
  
  const x = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [startX, midX, finalX * 1.5, finalX]);
  const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [startY, midY, finalY * 1.5, finalY]);
  const rotate = useTransform(smoothProgress, [0, 1], [startRot, 0]);
  
  // Morph from rounded sand to square pixels
  const rounded = useTransform(smoothProgress, [0, 0.8, 1], ['50%', '20%', '0%']);
  
  // Fade out as the main solid tiles fade in
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.85, 0.95], [0, 0.6, 0.8, 0]);

  return (
    <motion.div
      className="absolute"
      style={{
        width: 8,
        height: 8,
        backgroundColor: color,
        x,
        y,
        rotate,
        opacity,
        borderRadius: rounded,
        boxShadow: \\\`0 0 10px \\\${color}40\\\`,
      }}
    />
  );
});

export const MicrosoftBackgroundLogo = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 15 });
  const containerRef = useRef(null);

  // Mouse interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const parallaxX1 = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const parallaxY1 = useTransform(smoothMouseY, [-1, 1], [-20, 20]);

  // Generate sand grains once
  const grains = useMemo(() => {
    const TILES = [
      { id: 'red', hex: '#F25022', cX: -32, cY: -32 },
      { id: 'green', hex: '#7FBA00', cX: 32, cY: -32 },
      { id: 'blue', hex: '#00A4EF', cX: -32, cY: 32 },
      { id: 'yellow', hex: '#FFB900', cX: 32, cY: 32 },
    ];
    const res = [];
    const PIECES_PER_SIDE = 7; // 7x8 = 56px per tile (w-14)
    const PIECE_SIZE = 8;
    
    let seedCounter = 1;
    for (const tile of TILES) {
      // Calculate top-left center of this tile's grid
      const startOffsetX = tile.cX - (PIECES_PER_SIDE * PIECE_SIZE) / 2 + (PIECE_SIZE / 2);
      const startOffsetY = tile.cY - (PIECES_PER_SIDE * PIECE_SIZE) / 2 + (PIECE_SIZE / 2);

      for (let r = 0; r < PIECES_PER_SIDE; r++) {
        for (let c = 0; c < PIECES_PER_SIDE; c++) {
          res.push({
            id: \\\`\\\${tile.id}-\\\${r}-\\\${c}\\\`,
            color: tile.hex,
            finalX: startOffsetX + c * PIECE_SIZE,
            finalY: startOffsetY + r * PIECE_SIZE,
            seed: seedCounter++
          });
        }
      }
    }
    return res;
  }, []);

  const overallScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 1.4]);
  const overallOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.15, 0.2, 0.25, 0.35]);
  
  // The solid holographic tiles fade in at the very end when sand finishes assembling
  const solidTilesOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const logoTextOpacity = useTransform(smoothProgress, [0, 0.75, 1], [0, 0.2, 0.95]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex flex-col items-center justify-center select-none bg-gradient-to-b from-transparent to-neutral-50/50 dark:to-neutral-900/50 transition-colors duration-700">
      
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-400/5 blur-[120px] pointer-events-none mix-blend-screen"
        style={{ x: useTransform(smoothMouseX, [-1, 1], [-300, 300]), y: useTransform(smoothMouseY, [-1, 1], [-300, 300]) }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_80%,transparent_100%)] opacity-60 dark:opacity-40" />
      
      {/* Holographic Scanlines */}
      <div className="hologram-scanlines" />

      {/* Center animated Microsoft Logo cluster */}
      <motion.div
        style={{
          scale: overallScale,
          opacity: overallOpacity,
          x: parallaxX1,
          y: parallaxY1
        }}
        className="relative flex flex-col items-center justify-center mb-16"
      >
        <div className="relative w-44 h-44 flex items-center justify-center">
          
          {/* Sand Particles (visible from 0 to 0.95) */}
          {grains.map((g) => (
            <SandGrain key={g.id} smoothProgress={smoothProgress} color={g.color} finalX={g.finalX} finalY={g.finalY} seed={g.seed} />
          ))}

          {/* Solid Hologram Tiles (fade in at the end to replace the sand) */}
          <motion.div style={{ opacity: solidTilesOpacity }} className="absolute inset-0 flex items-center justify-center">
            {/* Top-Left: Red */}
            <motion.div style={{ x: -32, y: -32, backgroundColor: '#F25022' }} className="absolute w-14 h-14 rounded-sm shadow-2xl shadow-[#F25022]/40 hologram-effect" />
            {/* Top-Right: Green */}
            <motion.div style={{ x: 32, y: -32, backgroundColor: '#7FBA00' }} className="absolute w-14 h-14 rounded-sm shadow-2xl shadow-[#7FBA00]/40 hologram-effect" />
            {/* Bottom-Left: Blue */}
            <motion.div style={{ x: -32, y: 32, backgroundColor: '#00A4EF' }} className="absolute w-14 h-14 rounded-sm shadow-2xl shadow-[#00A4EF]/40 hologram-effect" />
            {/* Bottom-Right: Yellow */}
            <motion.div style={{ x: 32, y: 32, backgroundColor: '#FFB900' }} className="absolute w-14 h-14 rounded-sm shadow-2xl shadow-[#FFB900]/40 hologram-effect" />
          </motion.div>

        </div>

        {/* Microsoft Learn Wordmark appearing at bottom scroll */}
        <motion.div
          style={{ opacity: logoTextOpacity }}
          className="mt-8 flex flex-col items-center gap-3 text-xs font-semibold tracking-wider uppercase text-neutral-600 dark:text-neutral-300 backdrop-blur-sm px-6 py-3 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-neutral-700 to-neutral-500 bg-clip-text text-transparent dark:from-neutral-200 dark:to-neutral-400">Microsoft</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-blue-500 font-bold">Learn Path Complete</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
`;
fs.writeFileSync('src/components/MicrosoftBackgroundLogo.tsx', code);
console.log('Sand effect added');
