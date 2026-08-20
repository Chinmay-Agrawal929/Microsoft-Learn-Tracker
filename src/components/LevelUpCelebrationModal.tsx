import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2, Award, Sparkles, Check, ArrowRight, Trophy, Star, Zap, Shield, Crown
} from 'lucide-react';

export interface XpMilestoneTier {
  level: number;
  badgeName: string;
  minXp: number;
  icon: string;
  color: string;
  perks: string[];
}

export const XP_TIERS: XpMilestoneTier[] = [
  {
    level: 1,
    badgeName: 'Cloud Architect Rookie',
    minXp: 0,
    icon: 'Sparkles',
    color: '#0078D4',
    perks: ['Access to Microsoft Fundamentals Certifications', 'Interactive Sandbox Labs', 'Copilot Basic Tutor']
  },
  {
    level: 2,
    badgeName: 'Azure Practitioner',
    minXp: 500,
    icon: 'Zap',
    color: '#00A4EF',
    perks: ['Unlock Associate Multi-Service Modules', 'Daily Streak XP Multipliers', 'Custom Lab Study Notes']
  },
  {
    level: 3,
    badgeName: 'Certified Cloud Associate',
    minXp: 1500,
    icon: 'Shield',
    color: '#7FBA00',
    perks: ['Expert Architecture Deep-Dives', 'Advanced Azure CLI & PowerShell Lab Scripts', 'Voice Reading for Copilot']
  },
  {
    level: 4,
    badgeName: 'Enterprise Solutions Specialist',
    minXp: 3000,
    icon: 'Trophy',
    color: '#FFB900',
    perks: ['Well-Architected Framework Auditing Lab', 'Full Exam Scenario Simulator', 'High-Priority Copilot Context']
  },
  {
    level: 5,
    badgeName: 'Principal Architect & AI Master',
    minXp: 5000,
    icon: 'Crown',
    color: '#F25022',
    perks: ['Master of Azure Ecosystem Badge', 'All Cross-Domain Specializations Unlocked', 'Exclusive Leaderboard Crown']
  }
];

export const getTierForXp = (xp: number): XpMilestoneTier => {
  for (let i = XP_TIERS.length - 1; i >= 0; i--) {
    if (xp >= XP_TIERS[i].minXp) {
      return XP_TIERS[i];
    }
  }
  return XP_TIERS[0];
};

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTier: XpMilestoneTier;
  totalXp: number;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  onClose,
  newTier,
  totalXp,
}) => {
  // Synthesize level-up chime
  useEffect(() => {
    if (isOpen) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.2, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.4);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.4);
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Particle generator for celebration
  const particles = Array.from({ length: 24 });

  
  const handleShare = async () => {
    const text = `I just reached Level ${newTier.level} (${newTier.badgeName}) on Microsoft Learn Tracker with ${totalXp.toLocaleString()} XP! 🚀`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Level Up!',
          text: text,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
        />

        {/* Celebration Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-2 border-amber-400 dark:border-amber-500 shadow-2xl rounded-3xl p-6 sm:p-8 text-center overflow-hidden z-10"
        >
          {/* Confetti Explosion Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((_, i) => {
              const colors = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900', '#8B5CF6'];
              const color = colors[i % colors.length];
              const angle = (i / particles.length) * 360;
              const distance = 90 + Math.random() * 80;

              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * distance,
                    y: Math.sin((angle * Math.PI) / 180) * distance,
                    opacity: [1, 1, 0],
                    scale: [0.5, 1.2, 0.4],
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>

          {/* Level Header Flag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-widest shadow-md mb-4 animate-bounce">
            <Star className="w-4 h-4 fill-white" />
            <span>LEVEL {newTier.level} UNLOCKED</span>
            <Star className="w-4 h-4 fill-white" />
          </div>

          {/* Badge Icon Presentation with Aura */}
          <div className="relative my-4 flex items-center justify-center">
            <div
              className="absolute w-28 h-28 rounded-full blur-xl opacity-60 animate-pulse"
              style={{ backgroundColor: newTier.color }}
            />

            <motion.div
              initial={{ rotate: -15, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="relative w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center text-white ring-4 ring-white dark:ring-neutral-800"
              style={{ backgroundColor: newTier.color }}
            >
              {newTier.level === 1 && <Sparkles className="w-12 h-12" />}
              {newTier.level === 2 && <Zap className="w-12 h-12" />}
              {newTier.level === 3 && <Shield className="w-12 h-12" />}
              {newTier.level === 4 && <Trophy className="w-12 h-12" />}
              {newTier.level >= 5 && <Crown className="w-12 h-12" />}
            </motion.div>
          </div>

          {/* Badge Title & Description */}
          <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            {newTier.badgeName}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Achieved at <strong className="text-neutral-900 dark:text-white">{totalXp.toLocaleString()} Total XP</strong>
          </p>

          {/* Unlocked Perks List */}
          <div className="mt-5 text-left p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Unlocked Certification Perks:</span>
            </p>
            {newTier.perks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-2">
            <button
              id="celebration-share-button"
              type="button"
              onClick={handleShare}
              className="py-3 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold text-sm transition-all"
              title="Share Achievement"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="celebration-claim-button"
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0078D4] via-[#00A4EF] to-[#6366F1] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Equip Badge & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
