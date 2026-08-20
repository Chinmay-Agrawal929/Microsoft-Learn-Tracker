import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Sparkles, CheckCircle2, Flame, Bell, Volume2 } from 'lucide-react';

interface PomodoroTimerProps {
  onCompleteSession: (minutes: number, xpEarned: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onCompleteSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(() => {
    return parseInt(localStorage.getItem('mslearn_pomodoro_count') || '0', 10);
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play audio chime when timer ends
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();

            if (mode === 'work') {
              const newCount = completedSessions + 1;
              setCompletedSessions(newCount);
              localStorage.setItem('mslearn_pomodoro_count', newCount.toString());
              onCompleteSession(25, 50); // 25 mins, +50 XP bonus!
              setShowCelebration(true);
              setMode('break');
              return 5 * 60; // 5 min break
            } else {
              setMode('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedSessions, onCompleteSession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (newMode: 'work' | 'break' = mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = mode === 'work' ? 25 * 60 : 5 * 60;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="relative">
      {/* Navbar Compact Pill */}
      <button
        id="pomodoro-header-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Pomodoro Deep Work Focus Timer (+50 XP per session)"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 ${
          isRunning
            ? mode === 'work'
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
            : 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isRunning
              ? mode === 'work'
                ? 'bg-rose-500 animate-ping'
                : 'bg-emerald-500 animate-ping'
              : 'bg-neutral-400'
          }`}
        />
        <span className="font-mono tracking-tight font-bold">{formatTime(timeLeft)}</span>
        <span className="hidden xl:inline text-[10px] opacity-75">
          {mode === 'work' ? 'Focus' : 'Break'}
        </span>
      </button>

      {/* Dropdown Floating Timer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 z-50 w-72 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Deep Work Timer
                  </h4>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0078D4] dark:text-[#2899F5]">
                  +50 XP Bonus
                </span>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-2 gap-1.5 my-3 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <button
                  type="button"
                  onClick={() => resetTimer('work')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'work'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  25m Study Focus
                </button>
                <button
                  type="button"
                  onClick={() => resetTimer('break')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'break'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  5m Quick Break
                </button>
              </div>

              {/* Central Large Timer Display */}
              <div className="text-center py-4 relative">
                <div className="font-mono text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  {mode === 'work' ? 'Continuous Certification Study' : 'Rest your eyes & hydrate'}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-3">
                  <motion.div
                    className={`h-full rounded-full ${
                      mode === 'work' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={toggleTimer}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                      : mode === 'work'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => resetTimer(mode)}
                  title="Reset Timer"
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Footer */}
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Completed Intervals:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {completedSessions} sessions ({(completedSessions * 25) / 60 >= 1 ? `${((completedSessions * 25) / 60).toFixed(1)} hrs` : `${completedSessions * 25} mins`})
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Completion Toast Notification */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl border border-neutral-700 flex items-center gap-3 max-w-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">25-Min Focus Complete!</p>
              <p className="text-[11px] opacity-80">+50 XP Awarded & study streak preserved.</p>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="text-xs font-bold opacity-60 hover:opacity-100 px-2 py-1"
            >
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
