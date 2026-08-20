/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Flame, Award, Map, List, Compass, BookOpen, Layers, CheckCircle2,
  Calendar, ArrowRight, ExternalLink, RefreshCw, Zap
} from 'lucide-react';

import {
  DomainId, LearningTrack, Module, Certification, UserProgressState,
  UserProfile, UserCustomTask, SmartNotification
} from './types';
import { LEARNING_TRACKS, INITIAL_USER_PROGRESS, INITIAL_USER_PROFILE } from './data/learningTracks';

import { MicrosoftBackgroundLogo } from './components/MicrosoftBackgroundLogo';
import { Navbar } from './components/Navbar';
import { DomainSelector } from './components/DomainSelector';
import { InteractiveRoadmap } from './components/InteractiveRoadmap';
import { CurriculumView } from './components/CurriculumView';
import { ModuleDetailDrawer } from './components/ModuleDetailDrawer';
import { CopilotWidget } from './components/CopilotWidget';
import { SmartNotificationModal } from './components/SmartNotificationModal';
import { MicrosoftAuthModal } from './components/MicrosoftAuthModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { QuizModal } from './components/QuizModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileNavBar } from './components/MobileNavBar';
import { CourseSelectionModal } from './components/CourseSelectionModal';
import { LevelUpCelebrationModal, getTierForXp, XpMilestoneTier, XP_TIERS } from './components/LevelUpCelebrationModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { SidebarMenu } from './components/SidebarMenu';
import { CreatorLogo } from './components/CreatorLogo';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'neon' | 'chrome-classic' | 'chrome-midnight' | 'chrome-mint' | 'chrome-rose' | 'chrome-lavender'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mslearn_theme');
      return (['light', 'dark', 'neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender'].includes(stored)) ? stored as 'light' | 'dark' | 'neon' | 'chrome-classic' | 'chrome-midnight' | 'chrome-mint' | 'chrome-rose' | 'chrome-lavender' : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return false;
  });


  // New States
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mslearn_sound');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    localStorage.setItem('mslearn_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track & View State
  const [tracks, setTracks] = useState<LearningTrack[]>(LEARNING_TRACKS);
  const [selectedDomain, setSelectedDomain] = useState<DomainId>('cloud');
  const [viewMode, setViewMode] = useState<'roadmap' | 'curriculum'>('roadmap');

  // User & Progress State
  const [progress, setProgress] = useState<UserProgressState>(INITIAL_USER_PROGRESS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [moduleStates, setModuleStates] = useState<Record<string, 'completed' | 'available' | 'locked'>>({});
  const [certStates, setCertStates] = useState<Record<string, 'completed' | 'available' | 'locked'>>({});
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);

  // Modals & Drawers State
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [smartNotification, setSmartNotification] = useState<SmartNotification | null>(null);
  const [quizModule, setQuizModule] = useState<Module | null>(null);
  const [quizCert, setQuizCert] = useState<Certification | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);

  // Level-Up Celebration System State
  const [levelUpTier, setLevelUpTier] = useState<XpMilestoneTier | null>(null);
  const prevTierLevelRef = useRef<number>(getTierForXp(INITIAL_USER_PROGRESS.totalXp).level);

  // Sync theme to document element
  useEffect(() => {
    if (theme !== 'light' && theme !== 'chrome-classic' && theme !== 'chrome-mint' && theme !== 'chrome-rose' && theme !== 'chrome-lavender') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender');
      if (theme !== 'dark' && theme !== 'light') {
        document.documentElement.classList.add(theme);
      }
      localStorage.setItem('mslearn_theme', theme);
    } else {
      document.documentElement.classList.remove('dark', 'neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender');
      if (theme !== 'light') document.documentElement.classList.add(theme);
      localStorage.setItem('mslearn_theme', theme);
    }
  }, [theme]);

  // Initial fetch from backend
  const fetchProgressAndTracks = async () => {
    try {
      setIsLoadingTracks(true);
      const res = await fetch('/api/user/progress');
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          setProgress(data.progress);
          prevTierLevelRef.current = getTierForXp(data.progress.totalXp).level;
        }
        if (data.profile) setProfile(data.profile);
        if (data.moduleStates) setModuleStates(data.moduleStates);
        if (data.certStates) setCertStates(data.certStates);
      }
    } catch (err) {
      console.error('Fetch progress error:', err);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  useEffect(() => {
    fetchProgressAndTracks();

    // Check if onboarding course selection prompt was shown
    const hasChosenCourse = localStorage.getItem('mslearn_has_chosen_course');
    if (!hasChosenCourse) {
      setIsCourseModalOpen(true);
    }
  }, []);

  // Check for XP level-up whenever totalXp changes
  const checkXpLevelUp = (newXp: number) => {
    const newTier = getTierForXp(newXp);
    if (newTier.level > prevTierLevelRef.current) {
      prevTierLevelRef.current = newTier.level;
      setLevelUpTier(newTier);
      window.dispatchEvent(new CustomEvent('copilot-cheer', {
        detail: { message: `🎉 LEVEL UP! You reached ${newTier.badgeName}! Level ${newTier.level} unlocked! You are unstoppable! 👑🚀` }
      }));
    }
  };

  // Global Keyboard Shortcut Manager
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs or textareas
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-copilot'));
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setViewMode(prev => (prev === 'roadmap' ? 'curriculum' : 'roadmap'));
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        const pomodoroBtn = document.getElementById('pomodoro-header-button');
        if (pomodoroBtn) pomodoroBtn.click();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'neon' : 'light');
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsCourseModalOpen(true);
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAnalyticsModalOpen(true);
      } else if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Current selected track
  const currentTrack = tracks.find(t => t.id === selectedDomain) || tracks[0];

  // Helper: Trigger confetti celebration
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0078D4', '#7FBA00', '#F25022', '#FFB900', '#9B51E0'],
    });
  };

  // 1. Toggle Micro-Task Checkbox
  const handleToggleTask = async (taskId: string) => {
    const isCompleted = progress.completedTaskIds.includes(taskId);
    const updatedTaskIds = isCompleted
      ? progress.completedTaskIds.filter(id => id !== taskId)
      : [...progress.completedTaskIds, taskId];

    const xpDelta = isCompleted ? -150 : 150;
    const newTotalXp = Math.max(0, progress.totalXp + xpDelta);

    const newProgress = {
      ...progress,
      completedTaskIds: updatedTaskIds,
      totalXp: newTotalXp,
    };
    setProgress(newProgress);

    if (!isCompleted) {
      triggerConfetti();
      checkXpLevelUp(newTotalXp);
      window.dispatchEvent(new CustomEvent('copilot-cheer', {
        detail: { message: `Awesome work! Task verified! +150 XP gained! Keep going! 🔥` }
      }));
    }

    try {
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTaskIds: updatedTaskIds,
          totalXp: newTotalXp,
        }),
      });
      const data = await res.json();
      if (data.moduleStates) setModuleStates(data.moduleStates);
      if (data.certStates) setCertStates(data.certStates);
    } catch (err) {
      console.error('Sync task error:', err);
    }
  };

  // 2. Toggle Complete Module & Trigger AI Motivation
  const handleToggleCompleteModule = async (moduleId: string) => {
    const isCompleted = progress.completedModuleIds.includes(moduleId);
    const targetMod = currentTrack.certifications.flatMap(c => c.modules).find(m => m.id === moduleId);
    const targetCert = currentTrack.certifications.find(c => c.modules.some(m => m.id === moduleId));

    const updatedModuleIds = isCompleted
      ? progress.completedModuleIds.filter(id => id !== moduleId)
      : [...progress.completedModuleIds, moduleId];

    const xpDelta = isCompleted ? -(targetMod?.xp || 500) : (targetMod?.xp || 500);
    const newTotalXp = Math.max(0, progress.totalXp + xpDelta);

    const newProgress = {
      ...progress,
      completedModuleIds: updatedModuleIds,
      totalXp: newTotalXp,
      totalTimeMinutes: progress.totalTimeMinutes + (isCompleted ? 0 : (targetMod?.estimatedMinutes || 45)),
    };
    setProgress(newProgress);

    if (!isCompleted) {
      checkXpLevelUp(newTotalXp);
    }

    try {
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedModuleIds: updatedModuleIds,
          totalXp: newTotalXp,
          totalTimeMinutes: newProgress.totalTimeMinutes,
        }),
      });
      const data = await res.json();
      if (data.moduleStates) setModuleStates(data.moduleStates);
      if (data.certStates) setCertStates(data.certStates);

      if (!isCompleted && targetMod && targetCert) {
        triggerConfetti();
        window.dispatchEvent(new CustomEvent('copilot-cheer', {
          detail: { message: `🏆 Incredible! You finished "${targetMod.title}"! +${targetMod.xp} XP! You are mastering ${targetCert.code}! 🚀` }
        }));

        // Fetch AI Smart Motivational Note for next unlocked step
        const motivateRes = await fetch('/api/ai/motivate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completedModuleTitle: targetMod.title,
            unlockedModuleTitle: `Advanced ${targetCert.title}`,
            certCode: targetCert.code,
            trackName: currentTrack.name,
            userGoal: progress.targetGoal ? `Pass ${progress.targetGoal.certId}` : 'Excel in technical interviews',
          }),
        });

        if (motivateRes.ok) {
          const notifData = await motivateRes.json();
          setSmartNotification({
            id: `notif-${Date.now()}`,
            title: notifData.title || `Milestone Unlocked: ${targetMod.title}`,
            moduleTitle: targetMod.title,
            certCode: targetCert.code,
            motivationalNote: notifData.motivationalNote,
            whyItMatters: notifData.whyItMatters,
            recommendedTime: notifData.recommendedTime,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      }
    } catch (err) {
      console.error('Complete module error:', err);
    }
  };

  // 3. Custom Tasks CRUD
  const handleAddCustomTask = async (taskData: { title: string; moduleId: string; certId: string; priority: 'low' | 'medium' | 'high'; dueDate?: string }) => {
    try {
      const res = await fetch('/api/user/custom-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (data.customTasks) {
        setProgress(prev => ({ ...prev, customTasks: data.customTasks }));
      }
    } catch (err) {
      console.error('Add custom task error:', err);
    }
  };

  const handleUpdateCustomTask = async (id: string, updates: Partial<UserCustomTask>) => {
    try {
      const res = await fetch(`/api/user/custom-task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.customTasks) {
        setProgress(prev => ({ ...prev, customTasks: data.customTasks }));
      }
    } catch (err) {
      console.error('Update custom task error:', err);
    }
  };

  const handleDeleteCustomTask = async (id: string) => {
    try {
      const res = await fetch(`/api/user/custom-task/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.customTasks) {
        setProgress(prev => ({ ...prev, customTasks: data.customTasks }));
      }
    } catch (err) {
      console.error('Delete custom task error:', err);
    }
  };

  // 4. Save Notes
  const handleSaveNotes = async (moduleId: string, notes: string) => {
    const updatedNotes = { ...progress.moduleNotes, [moduleId]: notes };
    setProgress(prev => ({ ...prev, moduleNotes: updatedNotes }));

    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleNotes: updatedNotes }),
      });
    } catch (err) {
      console.error('Save notes error:', err);
    }
  };

  // 5. Quiz Passed Bonus
  const handleQuizPassed = (xpBonus: number) => {
    const newXp = progress.totalXp + xpBonus;
    setProgress(prev => ({ ...prev, totalXp: newXp }));
    triggerConfetti();
    checkXpLevelUp(newXp);
    window.dispatchEvent(new CustomEvent('copilot-cheer', {
      detail: { message: `🎯 Knowledge check mastered! +${xpBonus} XP! Outstanding cloud expertise! 🌟` }
    }));

    fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalXp: newXp }),
    });
  };

  // 6. Pomodoro Completion Bonus (+50 XP)
  const handlePomodoroComplete = (minutes: number, xpEarned: number) => {
    const newXp = progress.totalXp + xpEarned;
    const newTime = progress.totalTimeMinutes + minutes;
    setProgress(prev => ({
      ...prev,
      totalXp: newXp,
      totalTimeMinutes: newTime,
    }));
    triggerConfetti();
    checkXpLevelUp(newXp);
    window.dispatchEvent(new CustomEvent('copilot-cheer', {
      detail: { message: `⏱️ Great focus session! ${minutes}m deep study locked in! +${xpEarned} XP! Keep that rhythm! 🧘⚡` }
    }));

    fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalXp: newXp, totalTimeMinutes: newTime }),
    });
  };

  // 7. Course Track Selection
  const handleSelectTrack = (trackId: DomainId, targetGoal?: { certId: string; targetDate: string }) => {
    setSelectedDomain(trackId);
    localStorage.setItem('mslearn_has_chosen_course', 'true');
    if (targetGoal) {
      setProgress(prev => ({ ...prev, targetGoal }));
      fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGoal }),
      });
    }
  };

  // 8. Reset Demo Progress
  const handleResetProgress = async () => {
    const initial = { ...INITIAL_USER_PROGRESS };
    setProgress(initial);
    prevTierLevelRef.current = getTierForXp(initial.totalXp).level;
    try {
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initial),
      });
      const data = await res.json();
      if (data.moduleStates) setModuleStates(data.moduleStates);
      if (data.certStates) setCertStates(data.certStates);
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // All certifications flattened
  const allCertifications = tracks.flatMap(t => t.certifications);
  const completedCertsCount = allCertifications.filter(c =>
    c.modules.every(m => progress.completedModuleIds.includes(m.id))
  ).length;

  return (
    <div className="min-h-screen quantum-mesh-bg bg-neutral-50/90 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 relative flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Background Animated Microsoft Logo responding to scroll */}
      <MicrosoftBackgroundLogo />

      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'neon' : 'light')} onSetTheme={setTheme}
        userProfile={profile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenCourseSelection={() => setIsCourseModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenSidebarMenu={() => setIsSidebarMenuOpen(true)}
        onPomodoroComplete={handlePomodoroComplete}
        totalXp={progress.totalXp}
        streakDays={progress.studyStreakDays}
        completedCertsCount={completedCertsCount}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 sm:pb-12 relative z-10 space-y-6 sm:space-y-8">
        {/* Track Title & Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 p-6 sm:p-10 rounded-[2rem] glass-panel shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-3xl">
            
            {/* Quantum Orb Decoration */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-fuchsia-500/20 dark:bg-fuchsia-500/30 rounded-full blur-3xl animate-quantum-orbit pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-500/20 dark:bg-cyan-500/20 rounded-full blur-3xl animate-wave-interference pointer-events-none" />
            
            <div className="flex flex-wrap items-center gap-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-neutral-900 dark:bg-black text-fuchsia-400 border border-fuchsia-500/30 shadow-[0_0_10px_rgba(255,0,255,0.2)] animate-pulse">
                <Zap className="w-3 h-3 text-fuchsia-400" />
                <span>Quantum Sync Active</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0078D4] dark:text-[#2899F5] border border-blue-200 dark:border-blue-800/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Microsoft Official Certification Pathway</span>
              </div>

              <button
                type="button"
                onClick={() => setIsCourseModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors"
              >
                <Compass className="w-3 h-3 text-[#0078D4]" />
                <span>Choose / Switch Track</span>
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {(() => {
                  const hour = new Date().getHours();
                  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
                  return `${greeting}, ${profile.name.split(' ')[0]} 👋`;
                })()}
              </h2>
              <h1 className="text-xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
                {currentTrack.name}
              </h1>
            </div>

            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {currentTrack.tagline}
            </p>
          </div>

          {/* View Mode Toggle: Visual Roadmap vs Curriculum List */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0 self-stretch sm:self-start md:self-end justify-center">
            <motion.button
              id="view-roadmap-toggle"
              onClick={() => setViewMode('roadmap')}
              whileTap={{ scale: 0.96 }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'roadmap'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Visual Roadmap</span>
            </motion.button>

            <motion.button
              id="view-curriculum-toggle"
              onClick={() => setViewMode('curriculum')}
              whileTap={{ scale: 0.96 }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'curriculum'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>All Modules</span>
            </motion.button>
          </div>
        </div>

        {/* Domain Selector Tabs */}
        <DomainSelector
          tracks={tracks}
          selectedDomain={selectedDomain}
          onSelectDomain={(id) => setSelectedDomain(id)}
          completedModuleIds={progress.completedModuleIds}
        />

        {/* Dynamic Main View with Smooth AnimatePresence Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedDomain}-${viewMode}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
            className="w-full"
          >
            {viewMode === 'roadmap' ? (
              <InteractiveRoadmap
                certifications={currentTrack.certifications}
                moduleStates={moduleStates}
                certStates={certStates}
                completedTaskIds={progress.completedTaskIds}
                onSelectModule={(mod, cert) => {
                  setSelectedModule(mod);
                  setSelectedCert(cert);
                }}
                onSelectCert={(cert) => setSelectedCert(cert)}
              />
            ) : (
              <CurriculumView
                currentTrack={currentTrack}
                moduleStates={moduleStates}
                completedTaskIds={progress.completedTaskIds}
                onSelectModule={(mod, cert) => {
                  setSelectedModule(mod);
                  setSelectedCert(cert);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Module Detail Drawer */}
      {selectedModule && selectedCert && (
        <ModuleDetailDrawer
          module={selectedModule}
          certification={selectedCert}
          isCompleted={progress.completedModuleIds.includes(selectedModule.id)}
          completedTaskIds={progress.completedTaskIds}
          customTasks={progress.customTasks}
          moduleNotes={progress.moduleNotes[selectedModule.id] || ''}
          onClose={() => {
            setSelectedModule(null);
            setSelectedCert(null);
          }}
          onToggleTask={handleToggleTask}
          onToggleCompleteModule={handleToggleCompleteModule}
          onAddCustomTask={handleAddCustomTask}
          onUpdateCustomTask={handleUpdateCustomTask}
          onDeleteCustomTask={handleDeleteCustomTask}
          onSaveNotes={handleSaveNotes}
          onOpenQuiz={(mod, cert) => {
            setQuizModule(mod);
            setQuizCert(cert);
          }}
        />
      )}

      {/* AI Smart Notification Modal */}
      <SmartNotificationModal
        notification={smartNotification}
        onClose={() => setSmartNotification(null)}
        onExploreModule={() => {
          if (smartNotification) {
            const mod = currentTrack.certifications.flatMap(c => c.modules).find(m => m.title === smartNotification.moduleTitle);
            const cert = currentTrack.certifications.find(c => c.code === smartNotification.certCode);
            if (mod && cert) {
              setSelectedModule(mod);
              setSelectedCert(cert);
            }
          }
          setSmartNotification(null);
        }}
      />

      {/* AI Practice Quiz Modal */}
      <QuizModal
        module={quizModule}
        certification={quizCert}
        onClose={() => {
          setQuizModule(null);
          setQuizCert(null);
        }}
        onQuizPassed={handleQuizPassed}
      />

      {/* Course Onboarding & Goal Track Selection Modal */}
      <CourseSelectionModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        tracks={tracks}
        selectedDomain={selectedDomain}
        onSelectTrack={handleSelectTrack}
      />

      {/* Level-Up Badge Milestones Celebration Modal */}
      {levelUpTier && (
        <LevelUpCelebrationModal
          isOpen={!!levelUpTier}
          onClose={() => setLevelUpTier(null)}
          newTier={levelUpTier}
          totalXp={progress.totalXp}
        />
      )}

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Microsoft SSO Account Modal */}
      <MicrosoftAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={profile}
        onSaveProfile={(updates) => {
          setProfile(prev => ({ ...prev, ...updates }));
          fetch('/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
        }}
      />

      {/* Analytics Dashboard Modal */}
      <AnalyticsDashboard
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        tracks={tracks}
        progress={progress}
        profile={profile}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'neon' : 'light')} onSetTheme={setTheme}
        profile={profile}
        progress={progress}
        allCerts={allCertifications}
        onUpdateProfile={(updates) => setProfile(prev => ({ ...prev, ...updates }))}
        onSetTargetGoal={(certId, targetDate) => {
          const newGoal = { certId, targetDate };
          setProgress(prev => ({ ...prev, targetGoal: newGoal }));
          fetch('/api/user/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetGoal: newGoal }),
          });
        }}
        onResetProgress={handleResetProgress}
      />

      {/* 3-Lines Side Navigation Menu Drawer */}
      <SidebarMenu
        isOpen={isSidebarMenuOpen}
        onClose={() => setIsSidebarMenuOpen(false)}
        tracks={tracks}
        selectedDomain={selectedDomain}
        onSelectDomain={(id) => {
          setSelectedDomain(id);
          setIsSidebarMenuOpen(false);
        }}
        viewMode={viewMode}
        onSetViewMode={(mode) => setViewMode(mode)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'neon' : 'light')} onSetTheme={setTheme}
        userProfile={profile}
        progress={progress}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenCourseSelection={() => setIsCourseModalOpen(true)}
      />

      {/* Floating Microsoft Copilot Chatbot */}
      <CopilotWidget
        currentModule={selectedModule}
        currentCert={selectedCert}
      />

      {/* Mobile / Tablet Responsive Bottom Navigation Bar */}
      <MobileNavBar
        viewMode={viewMode}
        onSetViewMode={(mode) => setViewMode(mode)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'neon' : 'light')} onSetTheme={setTheme}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        userProfile={profile}
        streakDays={progress.studyStreakDays}
        totalXp={progress.totalXp}
        isReadingContent={Boolean(selectedModule)}
        userGender={profile.gender}
      />

      {/* Creator Logo fixed at the bottom left */}
      <motion.div 
        className="fixed bottom-24 sm:bottom-6 left-3 sm:left-6 z-40 pointer-events-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center bg-neutral-900/90 dark:bg-black/80 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl hover:bg-neutral-900 dark:hover:bg-black transition-colors group">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 mb-1 font-semibold group-hover:text-blue-400 transition-colors">Created By</span>
          <a href="https://chinmay-agrawal929.github.io/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <CreatorLogo className="scale-50 sm:scale-75 -mt-4 sm:-mt-2 -mb-6 sm:-mb-4 origin-center hover:scale-75 sm:hover:scale-90 transition-transform duration-500" />
          </a>
        </div>
      </motion.div>

      {/* Network Status Toast */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[100] bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-neutral-700"
          >
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <p className="text-xs font-medium">You are offline. Some features may be unavailable.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
