import React from 'react';
import {
  Sparkles, Moon, Sun, Flame, Award, Shield, UserCheck, Settings, Zap,
  BarChart3, Cloud, Compass, Keyboard, Menu
} from 'lucide-react';
import { UserProfile } from '../types';
import { PomodoroTimer } from './PomodoroTimer';
import { getTierForXp } from './LevelUpCelebrationModal';

interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
  userProfile: UserProfile;
  onOpenSidebarMenu: () => void;
  onOpenAuthModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenCourseSelection: () => void;
  onOpenShortcutsModal: () => void;
  onPomodoroComplete: (minutes: number, xpEarned: number) => void;
  totalXp: number;
  streakDays: number;
  completedCertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  userProfile,
  onOpenSidebarMenu,
  onOpenAuthModal,
  onOpenSettingsModal,
  onOpenAnalyticsModal,
  onOpenCourseSelection,
  onOpenShortcutsModal,
  onPomodoroComplete,
  totalXp,
  streakDays,
  completedCertsCount,
}) => {
  const currentTier = getTierForXp(totalXp);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-neutral-900/85 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & 3-Lines Extra Hamburger Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3-Lines Extra Hamburger Menu Button */}
          <button
            id="sidebar-hamburger-button"
            type="button"
            onClick={onOpenSidebarMenu}
            aria-label="Open full menu and resources"
            title="Open Menu & Certification Resources"
            className="p-2 -ml-1 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 transition-colors flex items-center justify-center"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>

          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* Microsoft 4-square icon */}
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5 flex-shrink-0 p-0.5 rounded shadow-sm bg-neutral-100 dark:bg-neutral-800">
              <div className="bg-[#F25022] rounded-xs" />
              <div className="bg-[#7FBA00] rounded-xs" />
              <div className="bg-[#00A4EF] rounded-xs" />
              <div className="bg-[#FFB900] rounded-xs" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white tracking-tight text-sm sm:text-base">
                  Microsoft <span className="text-[#0078D4] dark:text-[#2899F5] font-bold">Learn</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hidden md:block text-left">
                Path Tracker
              </span>
            </div>
          </a>

          <button
            type="button"
            onClick={onOpenCourseSelection}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold tracking-wide rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0078D4] dark:text-[#2899F5] border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors ml-1"
            title="Change Primary Career Track / Course"
          >
            <Compass className="w-3 h-3" />
            <span>Change Track</span>
          </button>
        </div>

        {/* Center/Right Metrics, Pomodoro Timer & Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Pomodoro Focus Timer in Header */}
          <PomodoroTimer onCompleteSession={onPomodoroComplete} />

          {/* Badge Level Pill */}
          <div
            id="badge-tier-indicator"
            onClick={onOpenAnalyticsModal}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: currentTier.color }}
            title={`Current Level ${currentTier.level}: ${currentTier.badgeName}`}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="max-w-[130px] truncate">{currentTier.badgeName}</span>
          </div>

          {/* Streak Counter */}
          <div
            id="streak-counter"
            title="Current learning streak"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* XP Counter */}
          <div
            id="xp-counter"
            title="Total Microsoft Learn Experience Points"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{totalXp.toLocaleString()}</span>
            <span className="text-[10px] opacity-75 font-normal hidden xs:inline">XP</span>
          </div>

          {/* Keyboard Shortcuts Button */}
          <button
            id="shortcuts-nav-button"
            onClick={onOpenShortcutsModal}
            aria-label="Keyboard shortcuts"
            title="Keyboard Shortcuts (Ctrl+K, Ctrl+M, Ctrl+P, ?)"
            className="hidden sm:flex p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button (available on mobile in bottom bar & sidebar) */}
          <button
            id="theme-toggle-button"
            onClick={onToggleTheme}
            aria-label="Toggle dark and light theme"
            title="Toggle Theme (Ctrl+D)"
            className="hidden sm:flex p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-neutral-600" /> : theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-fuchsia-400" />}
          </button>

          {/* Settings Button (available on mobile in sidebar & bottom bar) */}
          <button
            id="settings-nav-button"
            onClick={onOpenSettingsModal}
            aria-label="Open settings"
            className="hidden sm:flex p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Microsoft SSO Account Button */}
          <button
            id="sso-profile-button"
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1 sm:pr-2.5 sm:py-1 rounded-full border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/90 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
          >
            <div className="relative">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0078D4]"
                referrerPolicy="no-referrer"
              />
              {userProfile.isSignedIn && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-neutral-900" />
              )}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight truncate max-w-[100px]">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                {userProfile.isSignedIn ? 'Verified' : 'Sign in'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
