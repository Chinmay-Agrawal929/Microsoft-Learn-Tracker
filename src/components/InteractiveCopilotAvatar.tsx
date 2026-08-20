import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Flame, Zap, Award, Smile, ThumbsUp } from 'lucide-react';

export type CopilotExpression = 'idle' | 'happy' | 'cheering' | 'thinking' | 'winking' | 'surprised';

interface InteractiveCopilotAvatarProps {
  gender?: 'male' | 'female' | 'unspecified';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
  expression?: CopilotExpression;
  showCheerBubble?: boolean;
  cheerMessage?: string | null;
  onAvatarClick?: () => void;
  className?: string;
  enableInteractivePokes?: boolean;
}

const CHEER_PHRASES = [
  "You've got this, Cloud Champion! 🚀",
  "Awesome progress! Every module makes you stronger! 💪",
  "Your dedication to learning is inspiring! ✨",
  "High five! You're crushing this certification path! 🙌",
  "Keep that momentum going, future Azure Architect! ☁️",
  "Brilliant work! Knowledge is your superpower! 🧠",
  "One step closer to certified mastery! 🏆",
  "Consistency is key, and you are owning it today! 🔥",
  "Proud of your focus! Let's conquer the next unit! ⭐",
  "Fantastic job! The cloud has no limits for you! 🌟"
];

export const InteractiveCopilotAvatar: React.FC<InteractiveCopilotAvatarProps> = ({
  gender = 'unspecified',
  size = 'md',
  isThinking = false,
  expression: forcedExpression,
  showCheerBubble = false,
  cheerMessage = null,
  onAvatarClick,
  className = '',
  enableInteractivePokes = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<CopilotExpression>('idle');
  const [localCheerText, setLocalCheerText] = useState<string | null>(null);
  const [isPoked, setIsPoked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; icon: 'heart' | 'star' | 'flame' }[]>([]);

  // Calculate active expression
  const activeExpression: CopilotExpression = forcedExpression || (isThinking ? 'thinking' : currentExpression);

  // 1. Calculate pupil offset to follow mouse cursor anywhere on screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 1) {
        setPupilOffset({ x: 0, y: 0 });
        return;
      }

      // Max pupil excursion range in pixels depending on avatar size
      const maxOffset = size === 'sm' ? 2.5 : size === 'md' ? 3.5 : size === 'lg' ? 5 : 6.5;
      const angle = Math.atan2(deltaY, deltaX);

      // Smooth compression curve for natural eye look
      const clampedDistance = Math.min(distance / 80, 1) * maxOffset;
      const x = Math.cos(angle) * clampedDistance;
      const y = Math.sin(angle) * clampedDistance;

      setPupilOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  // 2. Global click / tap listener: Trigger eye blink whenever user clicks ANYWHERE
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    };

    window.addEventListener('pointerdown', triggerBlink);
    return () => window.removeEventListener('pointerdown', triggerBlink);
  }, []);

  // 3. Natural periodic idle blinking & random expressions
  useEffect(() => {
    let timeoutId: number;

    const scheduleRandomBlink = () => {
      const delay = Math.random() * 3000 + 3500;
      timeoutId = window.setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          // 20% chance to wink or smile on idle
          if (Math.random() < 0.25 && currentExpression === 'idle') {
            setCurrentExpression('happy');
            setTimeout(() => setCurrentExpression('idle'), 1800);
          }
          scheduleRandomBlink();
        }, 180);
      }, delay);
    };

    scheduleRandomBlink();
    return () => clearTimeout(timeoutId);
  }, [currentExpression]);

  // 4. Listen to global cheer events (from task completion, XP milestone, etc.)
  useEffect(() => {
    const handleCheerEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string; sound?: boolean }>;
      const msg = customEvent.detail?.message || CHEER_PHRASES[Math.floor(Math.random() * CHEER_PHRASES.length)];
      triggerCheerReaction(msg);
    };

    window.addEventListener('copilot-cheer', handleCheerEvent);
    return () => window.removeEventListener('copilot-cheer', handleCheerEvent);
  }, []);

  const triggerCheerReaction = (customPhrase?: string) => {
    const phrase = customPhrase || CHEER_PHRASES[Math.floor(Math.random() * CHEER_PHRASES.length)];
    setLocalCheerText(phrase);
    setCurrentExpression('cheering');
    setIsPoked(true);

    // Spawn floating celebration particles
    const newIcons: ('heart' | 'star' | 'flame')[] = ['star', 'heart', 'flame'];
    const newId = Date.now();
    setFloatingHeart(prev => [...prev.slice(-4), { id: newId, icon: newIcons[Math.floor(Math.random() * newIcons.length)] }]);

    setTimeout(() => {
      setIsPoked(false);
    }, 600);

    setTimeout(() => {
      setCurrentExpression('idle');
      setLocalCheerText(null);
    }, 4000);
  };

  const handlePoke = (e: React.MouseEvent) => {
    if (onAvatarClick) {
      onAvatarClick();
    }
    if (enableInteractivePokes) {
      e.stopPropagation();
      triggerCheerReaction();
    }
  };

  // Dimensional scale helpers
  const dimensions = {
    sm: { container: 'w-8 h-8', eye: 'w-2 h-2.5', pupil: 'w-1 h-1.2', spacing: 'gap-1', mouth: 'w-2.5 h-1' },
    md: { container: 'w-10 h-10', eye: 'w-2.5 h-3.5', pupil: 'w-1.4 h-1.8', spacing: 'gap-1.5', mouth: 'w-3.5 h-1.5' },
    lg: { container: 'w-13 h-13', eye: 'w-3 h-4.5', pupil: 'w-1.8 h-2.4', spacing: 'gap-2', mouth: 'w-4.5 h-2' },
    xl: { container: 'w-16 h-16', eye: 'w-3.5 h-5', pupil: 'w-2 h-2.8', spacing: 'gap-2.5', mouth: 'w-5 h-2.5' },
  }[size];

  const displayedCheer = cheerMessage || localCheerText;

  return (
    <div 
      className="relative inline-flex items-center justify-center"
      onClick={handlePoke}
      onMouseEnter={() => {
        setIsHovered(true);
        if (currentExpression === 'idle') setCurrentExpression('happy');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (currentExpression === 'happy' && !localCheerText) setCurrentExpression('idle');
      }}
    >
      {/* Interactive Speech / Cheer Bubble */}
      <AnimatePresence>
        {(showCheerBubble || displayedCheer) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-max max-w-[220px] sm:max-w-[260px]"
          >
            <div className="relative px-3 py-2 rounded-2xl bg-neutral-900/95 dark:bg-white/95 text-white dark:text-neutral-950 text-xs font-semibold shadow-2xl border border-blue-400/50 dark:border-blue-500/50 backdrop-blur-md text-center leading-snug">
              <div className="flex items-center justify-center gap-1.5 mb-0.5 text-[#00A4EF] dark:text-[#0078D4] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Copilot Cheers</span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium">{displayedCheer}</p>

              {/* Triangle Tail */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-neutral-900/95 dark:border-t-white/95 border-t-[7px] border-x-transparent border-x-[7px] border-b-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkle Particles when cheered */}
      {floatingHeart.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 1, y: 0, x: (Math.random() - 0.5) * 20, scale: 0.8 }}
          animate={{ opacity: 0, y: -45, scale: 1.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute pointer-events-none z-50"
        >
          {item.icon === 'star' ? (
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 drop-shadow" />
          ) : item.icon === 'heart' ? (
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 drop-shadow" />
          ) : (
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 drop-shadow" />
          )}
        </motion.div>
      ))}

      {/* Main Interactive Robot Avatar Face */}
      <motion.div
        ref={containerRef}
        animate={
          isPoked
            ? { scale: [1, 1.22, 0.92, 1.08, 1], rotate: [0, -8, 8, -4, 0] }
            : isHovered
            ? { scale: 1.08, y: -2 }
            : { scale: 1, y: 0 }
        }
        transition={isPoked ? { duration: 0.5 } : { type: 'spring', damping: 15, stiffness: 350 }}
        className={`relative ${dimensions.container} rounded-full bg-gradient-to-tr from-[#0078D4] via-[#7B2CBF] to-[#00A4EF] p-0.5 shadow-lg flex items-center justify-center cursor-pointer select-none ${className}`}
        title="Quantum Copilot AI (Tracks cursor, blinks on click, tap me for cheers!)"
      >
        {/* Glowing Aura Ring */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 transition-opacity duration-300 ${
            activeExpression === 'cheering'
              ? 'opacity-90 blur-sm animate-spin'
              : isHovered
              ? 'opacity-70 blur-xs'
              : 'opacity-40 blur-xs'
          }`}
          style={{ animationDuration: '4s' }}
        />

        {/* Top Antenna / Holographic Emitter Bulb */}
        <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-400 border border-white/60 animate-pulse" />

        {/* Face Screen Capsule / Orb Surface */}
        <div className="relative w-full h-full rounded-full bg-neutral-950/95 flex flex-col items-center justify-center overflow-hidden border border-white/35 backdrop-blur-md shadow-inner">
          {/* Subtle Top Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

          {/* Thinking Radial Scanner Indicator */}
          {isThinking && (
            <div
              className="absolute inset-0 border-2 border-dashed border-cyan-300 rounded-full animate-spin"
              style={{ animationDuration: '2.5s' }}
            />
          )}

          
          {/* Gender Silhouette Overrides */}
          {gender === 'male' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 z-20 pointer-events-none">
              {/* Abstract Male Head & Shoulders */}
              <div className="w-2.5 h-3 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-t-full rounded-b-md shadow-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-full mt-0.5 opacity-90 shadow-[0_-2px_10px_rgba(34,211,238,0.5)]" />
              {isThinking && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-b-2 border-cyan-300 rounded-full animate-spin" />
              )}
            </div>
          )}
          {gender === 'female' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 z-20 pointer-events-none">
              {/* Abstract Female Head & Shoulders (curved hair/bob shape) */}
              <div className="relative w-3.5 h-3.5 bg-gradient-to-b from-fuchsia-400 via-purple-500 to-indigo-500 rounded-full shadow-fuchsia-400/50 shadow-[0_0_10px_rgba(232,121,249,0.8)] flex items-center justify-center">
                 <div className="absolute bottom-0 w-2.5 h-2.5 bg-neutral-900 rounded-full border-t border-fuchsia-300/30" />
              </div>
              <div className="w-4 h-2 bg-gradient-to-t from-indigo-600 to-fuchsia-500 rounded-t-full mt-0.5 opacity-90 shadow-[0_-2px_10px_rgba(232,121,249,0.5)]" />
              {isThinking && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-b-2 border-fuchsia-300 rounded-full animate-spin" />
              )}
            </div>
          )}
          
          {/* Eyes Layer */}

          <div
            className={`flex items-center ${dimensions.spacing} z-10 transition-transform ${gender !== 'unspecified' ? 'hidden' : ''} ${
              isHovered || activeExpression === 'happy' || activeExpression === 'cheering' ? '-translate-y-0.5' : ''
            }`}
          >
            {/* LEFT EYE */}
            {activeExpression === 'cheering' ? (
              // Star Cheerful Eye
              <div className="text-amber-300 animate-bounce">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-300" />
              </div>
            ) : activeExpression === 'happy' || isBlinking ? (
              // Happy Curved Arch Eyes (^_^)
              <div className="w-2 h-1 sm:w-2.5 sm:h-1.5 border-t-2 border-x-transparent border-b-0 border-t-cyan-300 rounded-t-full transition-all" />
            ) : (
              // Standard Eye with Pupil Tracking
              <div
                className={`relative rounded-full bg-cyan-100 flex items-center justify-center overflow-hidden transition-all duration-100 ${
                  isHovered ? `${dimensions.eye} bg-cyan-200 ring-1 ring-cyan-300` : `${dimensions.eye} bg-white`
                }`}
                style={{
                  boxShadow: '0 0 6px rgba(34, 211, 238, 0.85)',
                }}
              >
                <div
                  className="rounded-full bg-neutral-950 relative transition-transform duration-75 ease-out"
                  style={{
                    width: size === 'sm' ? '4px' : size === 'md' ? '5px' : '7px',
                    height: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  }}
                >
                  {/* Catchlight Glint */}
                  <span
                    className="absolute top-0.5 left-0.5 rounded-full bg-white opacity-95"
                    style={{
                      width: size === 'sm' ? '1.5px' : '2px',
                      height: size === 'sm' ? '1.5px' : '2px',
                    }}
                  />
                </div>
              </div>
            )}

            {/* RIGHT EYE */}
            {activeExpression === 'cheering' ? (
              // Star Cheerful Eye
              <div className="text-amber-300 animate-bounce" style={{ animationDelay: '100ms' }}>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-300" />
              </div>
            ) : activeExpression === 'winking' ? (
              // Winking Right Eye
              <div className="w-2.5 h-0.5 bg-cyan-300 rounded-full" />
            ) : activeExpression === 'happy' || isBlinking ? (
              // Happy Curved Arch Eye
              <div className="w-2 h-1 sm:w-2.5 sm:h-1.5 border-t-2 border-x-transparent border-b-0 border-t-cyan-300 rounded-t-full transition-all" />
            ) : (
              // Standard Eye with Pupil Tracking
              <div
                className={`relative rounded-full bg-cyan-100 flex items-center justify-center overflow-hidden transition-all duration-100 ${
                  isHovered ? `${dimensions.eye} bg-cyan-200 ring-1 ring-cyan-300` : `${dimensions.eye} bg-white`
                }`}
                style={{
                  boxShadow: '0 0 6px rgba(34, 211, 238, 0.85)',
                }}
              >
                <div
                  className="rounded-full bg-neutral-950 relative transition-transform duration-75 ease-out"
                  style={{
                    width: size === 'sm' ? '4px' : size === 'md' ? '5px' : '7px',
                    height: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  }}
                >
                  {/* Catchlight Glint */}
                  <span
                    className="absolute top-0.5 left-0.5 rounded-full bg-white opacity-95"
                    style={{
                      width: size === 'sm' ? '1.5px' : '2px',
                      height: size === 'sm' ? '1.5px' : '2px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cheerful Rosy Blushing Cheeks when Happy or Cheering */}
          {(isHovered || activeExpression === 'happy' || activeExpression === 'cheering') && gender === 'unspecified' && (
            <div className="absolute inset-x-1.5 bottom-2 flex justify-between px-0.5 pointer-events-none">
              <div className="w-1.5 h-1 rounded-full bg-rose-400/80 blur-2xs animate-pulse" />
              <div className="w-1.5 h-1 rounded-full bg-rose-400/80 blur-2xs animate-pulse" />
            </div>
          )}

          {/* Expressive Mouth / Smile */}
          <div className={`mt-0.5 z-10 flex items-center justify-center ${gender !== 'unspecified' ? 'hidden' : ''}`}>
            {activeExpression === 'cheering' ? (
              // Big Open Joyful Mouth (D)
              <div className="w-3 h-1.5 bg-gradient-to-b from-cyan-300 to-blue-400 rounded-b-full border-t border-cyan-100 shadow-xs" />
            ) : isHovered || activeExpression === 'happy' ? (
              // Cute Smiling Curved Mouth (u)
              <div className="w-2.5 h-1 border-b-2 border-x-transparent border-t-0 border-b-cyan-300 rounded-b-full transition-all" />
            ) : isThinking ? (
              // Thinking Wave Line
              <div className="w-2 h-0.5 bg-cyan-400/80 rounded-full animate-pulse" />
            ) : (
              // Gentle Rest Smile
              <div className="w-1.5 h-0.5 bg-cyan-400/60 rounded-full" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
