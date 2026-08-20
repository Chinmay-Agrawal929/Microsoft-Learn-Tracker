import React, { useEffect, useRef } from 'react';

export const CreatorLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const lx = canvas.getContext('2d');
    if (!lx) return;

    const LW = 212;
    const LH = 86;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = LW * dpr;
    canvas.height = LH * dpr;
    lx.scale(dpr, dpr);
    canvas.style.width = `${LW}px`;
    canvas.style.height = `${LH}px`;

    const PARTS = Array.from({ length: 20 }, (_, i) => ({
      a: (i / 20) * Math.PI * 2,
      r: 20 + (i % 4) * 5,
      spd: 0.004 + (i % 4) * 0.003,
      sz: 1 + (i % 3) * 0.7,
      al: 0.2 + (i % 5) * 0.1
    }));

    let dp = 0;
    let animationFrameId: number;

    const draw = (t: number) => {
      lx.clearRect(0, 0, LW, LH);
      
      const cx = LW / 2;
      const cy = 33;
      const p = 0.5 + 0.5 * Math.sin(t * 0.0018); // Use timestamp for smooth animation
      
      const g = lx.createRadialGradient(cx, cy, 0, cx, cy, 34);
      g.addColorStop(0, `rgba(0, 255, 136, ${0.06 + p * 0.05})`);
      g.addColorStop(1, 'rgba(0, 255, 136, 0)');
      
      lx.fillStyle = g;
      lx.beginPath();
      lx.arc(cx, cy, 34, 0, Math.PI * 2);
      lx.fill();
      
      lx.save();
      lx.translate(cx, cy);
      lx.rotate(t * 0.00035);
      
      lx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      lx.lineWidth = 1;
      lx.setLineDash([3, 6]);
      lx.beginPath();
      lx.arc(0, 0, 22, 0, Math.PI * 2);
      lx.stroke();
      lx.setLineDash([]);
      lx.restore();
      
      PARTS.forEach(pt => {
        pt.a += pt.spd;
        lx.save();
        lx.globalAlpha = pt.al + 0.1 * Math.sin(t * 0.002 + pt.a);
        lx.fillStyle = '#00ff88';
        lx.shadowColor = '#00ff88';
        lx.shadowBlur = 5;
        lx.beginPath();
        lx.arc(cx + Math.cos(pt.a) * pt.r, cy + Math.sin(pt.a) * pt.r, pt.sz, 0, Math.PI * 2);
        lx.fill();
        lx.restore();
      });
      
      dp = Math.min(1, dp + 0.013);
      
      const pts = [
        [cx, cy - 14],
        [cx + 12, cy],
        [cx, cy + 14],
        [cx - 12, cy]
      ];
      
      lx.save();
      lx.strokeStyle = '#00ff88';
      lx.lineWidth = 2;
      lx.shadowColor = '#00ff88';
      lx.shadowBlur = 10;
      lx.setLineDash([52 * dp, 52]);
      lx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? lx.moveTo(px, py) : lx.lineTo(px, py));
      lx.closePath();
      lx.stroke();
      lx.setLineDash([]);
      
      lx.globalAlpha = 0.07 + 0.04 * p;
      lx.fillStyle = '#00ff88';
      lx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? lx.moveTo(px, py) : lx.lineTo(px, py));
      lx.closePath();
      lx.fill();
      lx.restore();
      
      lx.save();
      lx.globalAlpha = dp;
      lx.font = '12px monospace';
      lx.fillStyle = '#00ff88';
      lx.textAlign = 'center';
      lx.fillText('CHINMAY AGRAWAL', cx, cy + 45);
      lx.restore();
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    animationFrameId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 ${className}`}>
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
};
