import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Map, List, Award, Moon, Sun, Settings, User, Sparkles, Flame, Zap,
  ChevronDown, ChevronUp, Compass, LayoutGrid
} from 'lucide-react';
import { DomainId, UserProfile } from '../types';

interface MobileNavBarProps {
  viewMode: 'roadmap' | 'curriculum';
  onSetViewMode: (mode: 'roadmap' | 'curriculum') => void;
  theme: string;
  onToggleTheme: () => void;
  onOpenAnalytics: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  userProfile: UserProfile;
  streakDays: number;
  totalXp: number;
  isReadingContent?: boolean;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  viewMode,
  onSetViewMode,
  theme,
  onToggleTheme,
  onOpenAnalytics,
  onOpenSettings,
  onOpenAuth,
  userProfile,
  streakDays,
  totalXp,
  isReadingContent = false,
}) => {
  // Track manual override for expansion/collapse
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);

  // When reading state changes, reset manual override
  useEffect(() => {
    setIsManuallyExpanded(false);
    setIsManuallyCollapsed(false);
  }, [isReadingContent]);

  // Determine effective collapse state:
  // If actively reading content, default to collapsed unless user explicitly expanded it.
  // Otherwise, default to persistent shelf unless user explicitly collapsed it.
  const isCollapsed = isReadingContent
    ? !isManuallyExpanded
    : isManuallyCollapsed;

  const handleToggleShelf = () => {
    if (isReadingContent) {
      setIsManuallyExpanded((prev) => !prev);
    } else {
      setIsManuallyCollapsed((prev) => !prev);
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        type: 'spring',
        damping: 26,
        stiffness: 300,
        mass: 0.8,
        opacity: { duration: 0.25, ease: 'easeInOut' },
      }}
      className="mobile-nav-bar-container md:hidden fixed bottom-0 left-0 right-0 z-30 pointer-events-none transition-all duration-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCollapsed ? (
          /* Collapsed Mode: Single Floating Action Button (FAB) */
          <motion.div
            key="collapsed-fab"
            layout="position"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 320,
              opacity: { duration: 0.2 },
            }}
            className="p-3 pb-4 flex justify-start items-center"
          >
            <motion.button
              type="button"
              id="mobile-nav-fab-button"
              onClick={handleToggleShelf}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="pointer-events-auto flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 backdrop-blur-2xl border border-blue-500/25 dark:border-blue-400/30 shadow-[0_4px_24px_rgba(0,120,212,0.18)] dark:shadow-[0_4px_28px_rgba(0,120,212,0.32)] ring-1 ring-blue-500/10 group relative overflow-hidden"
              title="Expand navigation shelf"
            >
              {/* Subtle Ambient Shimmer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0078D4]/5 dark:via-blue-400/10 to-transparent pointer-events-none" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0078D4] to-[#6366F1] text-white flex items-center justify-center flex-shrink-0 shadow-xs relative z-10">
                {viewMode === 'roadmap' ? (
                  <Map className="w-3.5 h-3.5" />
                ) : (
                  <List className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold tracking-tight capitalize leading-none text-neutral-900 dark:text-white">
                  {viewMode}
                </span>
                <span className="text-[9px] text-[#0078D4] dark:text-[#2899F5] font-medium leading-tight">
                  Tap to navigate
                </span>
              </div>

              {streakDays > 0 && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold ml-0.5">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{streakDays}d</span>
                </div>
              )}
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-transform ml-0.5" />
            </motion.button>
          </motion.div>
        ) : (
          /* Expanded Mode: Persistent Bottom Shelf */
          <motion.div
            key="expanded-shelf"
            layout="position"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 300,
              opacity: { duration: 0.22, ease: 'easeInOut' },
            }}
            className="pointer-events-auto relative bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border-t border-blue-500/20 dark:border-blue-400/25 shadow-[0_-8px_30px_rgba(0,120,212,0.12)] dark:shadow-[0_-8px_32px_rgba(0,120,212,0.24)] safe-area-bottom pb-1 before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#0078D4]/50 dark:before:via-[#2899F5]/60 before:to-transparent"
          >
            {/* Top Drag/Collapse Handle */}
            <div className="flex justify-center pt-1.5 pb-0.5">
              <button
                type="button"
                id="mobile-nav-collapse-handle"
                onClick={handleToggleShelf}
                className="group flex items-center gap-1 px-3 py-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                title="Collapse to floating action button"
              >
                <span className="w-7 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-neutral-400 transition-colors" />
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            {/* Navigation Shelf Action Items */}
            <div className="flex items-center justify-around px-2 py-1">
              {/* Roadmap View */}
              <button
                type="button"
                id="mobile-shelf-roadmap"
                onClick={() => {
                  onSetViewMode('roadmap');
                  if (isReadingContent) setIsManuallyExpanded(false);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[54px] min-h-[44px] transition-all ${
                  viewMode === 'roadmap'
                    ? 'text-[#0078D4] dark:text-[#2899F5] font-bold bg-blue-50/90 dark:bg-blue-950/70 scale-102'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Map className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">Roadmap</span>
              </button>

              {/* Curriculum View */}
              <button
                type="button"
                id="mobile-shelf-curriculum"
                onClick={() => {
                  onSetViewMode('curriculum');
                  if (isReadingContent) setIsManuallyExpanded(false);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[54px] min-h-[44px] transition-all ${
                  viewMode === 'curriculum'
                    ? 'text-[#0078D4] dark:text-[#2899F5] font-bold bg-blue-50/90 dark:bg-blue-950/70 scale-102'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <List className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">Modules</span>
              </button>

              {/* Badges & Analytics */}
              <button
                type="button"
                id="mobile-shelf-stats"
                onClick={onOpenAnalytics}
                className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[54px] min-h-[44px] text-neutral-500 dark:text-neutral-400 hover:text-[#0078D4] dark:hover:text-[#2899F5] transition-colors"
              >
                <div className="relative">
                  <Award className="w-4 h-4 mb-0.5 text-emerald-500" />
                  {streakDays > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full bg-amber-500 text-white text-[8px] font-black">
                      {streakDays}d
                    </span>
                  )}
                </div>
                <span className="text-[10px]">Stats</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                id="mobile-shelf-theme-toggle"
                type="button"
                onClick={onToggleTheme}
                className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[54px] min-h-[44px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                <span className="text-[10px]">{theme === 'light' ? 'Dark' : theme === 'dark' ? 'Neon' : 'Light'}</span>
              </button>

              {/* Profile / Account SSO */}
              <button
                type="button"
                id="mobile-shelf-account"
                onClick={onOpenAuth}
                className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[54px] min-h-[44px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                <div className="relative">
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-[#0078D4]"
                    referrerPolicy="no-referrer"
                  />
                  {userProfile.isSignedIn && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{userProfile.isSignedIn ? 'Account' : 'Sign In'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

