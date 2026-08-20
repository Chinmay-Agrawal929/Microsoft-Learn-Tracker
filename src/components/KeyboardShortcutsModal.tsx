import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Keyboard, Sparkles, Map, Flame, Moon, Compass, BarChart3, HelpCircle } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      combo: ['Ctrl', 'K'],
      mac: ['⌘', 'K'],
      label: 'Open Microsoft Copilot AI',
      desc: 'Ask questions, practice exam scenarios, or generate CLI scripts',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    },
    {
      combo: ['Ctrl', 'M'],
      mac: ['⌘', 'M'],
      label: 'Toggle View (Roadmap / Curriculum)',
      desc: 'Switch between the interactive graph and structured module list',
      icon: <Map className="w-4 h-4 text-blue-500" />,
    },
    {
      combo: ['Ctrl', 'P'],
      mac: ['⌘', 'P'],
      label: 'Pomodoro Focus Timer',
      desc: 'Start or view 25-minute deep study intervals (+50 XP)',
      icon: <Flame className="w-4 h-4 text-rose-500" />,
    },
    {
      combo: ['Ctrl', 'G'],
      mac: ['⌘', 'G'],
      label: 'Change Career Goal / Course',
      desc: 'Select your primary certification track and time commitments',
      icon: <Compass className="w-4 h-4 text-amber-500" />,
    },
    {
      combo: ['Ctrl', 'D'],
      mac: ['⌘', 'D'],
      label: 'Toggle Dark / Light Mode',
      desc: 'Switch between light and high-contrast dark Microsoft theme',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
    },
    {
      combo: ['Ctrl', 'A'],
      mac: ['⌘', 'A'],
      label: 'Analytics & Achievements',
      desc: 'View leaderboard status, time spent, and unlocked badges',
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
    },
    {
      combo: ['?'],
      mac: ['?'],
      label: 'Keyboard Shortcuts Help',
      desc: 'Display this cheat sheet anywhere in the application',
      icon: <Keyboard className="w-4 h-4 text-neutral-500" />,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Shortcuts Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-5 sm:p-7 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0078D4] dark:text-[#2899F5]">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
                <p className="text-xs text-neutral-500">
                  Quick hotkeys to navigate the roadmap at terminal speed
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of shortcuts */}
          <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
            {shortcuts.map((sc, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shadow-2xs">
                    {sc.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {sc.label}
                    </h4>
                    <p className="text-[10px] text-neutral-500 line-clamp-1">
                      {sc.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {sc.combo.map((key, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono font-bold shadow-2xs"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono font-bold">Esc</kbd> to close</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
