import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Compass, Map, List, BarChart3, Award, Sparkles, BookOpen,
  Layers, Shield, Cpu, Cloud, Database, GitBranch, Settings,
  Moon, Sun, ExternalLink, Keyboard, HelpCircle, Flame, CheckCircle2,
  Clock, FileText, Download, Share2, Lightbulb, Zap
} from 'lucide-react';
import { DomainId, LearningTrack, UserProfile, UserProgressState } from '../types';
import { InteractiveCopilotAvatar } from './InteractiveCopilotAvatar';
import { getTierForXp } from './LevelUpCelebrationModal';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: LearningTrack[];
  selectedDomain: DomainId;
  onSelectDomain: (id: DomainId) => void;
  viewMode: 'roadmap' | 'curriculum';
  onSetViewMode: (mode: 'roadmap' | 'curriculum') => void;
  theme: string;
  onToggleTheme: () => void;
  userProfile: UserProfile;
  progress: UserProgressState;
  onOpenAuthModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenCourseSelection: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  tracks,
  selectedDomain,
  onSelectDomain,
  viewMode,
  onSetViewMode,
  theme,
  onToggleTheme,
  userProfile,
  progress,
  onOpenAuthModal,
  onOpenAnalyticsModal,
  onOpenSettingsModal,
  onOpenShortcutsModal,
  onOpenCourseSelection,
}) => {
  const totalXp = progress?.totalXp ?? 0;
  const currentTier = getTierForXp(totalXp);
  const completedModuleIds = progress?.completedModuleIds ?? [];

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-blue-500" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-500" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'Database':
        return <Database className="w-4 h-4 text-amber-500" />;
      case 'GitBranch':
        return <GitBranch className="w-4 h-4 text-sky-500" />;
      default:
        return <Layers className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-sm sm:max-w-md bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col h-full z-10"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu & Resources"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  {/* Microsoft 4-box Brand */}
                  <div className="grid grid-cols-2 gap-0.5 w-6 h-6 flex-shrink-0 p-0.5 rounded shadow-sm bg-neutral-100 dark:bg-neutral-800">
                    <div className="bg-[#F25022] rounded-xs" />
                    <div className="bg-[#7FBA00] rounded-xs" />
                    <div className="bg-[#00A4EF] rounded-xs" />
                    <div className="bg-[#FFB900] rounded-xs" />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-1.5">
                      Microsoft <span className="text-[#0078D4] dark:text-[#2899F5]">Learn</span>
                    </h2>
                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      Path Tracker & Certification Hub
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Quick Profile Snippet */}
              <div className="px-4 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0078D4]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-[#0078D4] transition-colors truncate max-w-[140px]">
                      {userProfile.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Level {currentTier.level} ({totalXp} XP)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettingsModal();
                  }}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
                  title="Open Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Nav Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* 0. CURRENT TRACK PROGRESS WIDGET */}
                {(() => {
                  const currentTrack = tracks.find(t => t.id === selectedDomain);
                  if (!currentTrack) return null;
                  const trackModIds = currentTrack.certifications.flatMap(c => c.modules.map(m => m.id));
                  const doneCount = trackModIds.filter(id => progress.completedModuleIds?.includes(id)).length;
                  const totalCount = trackModIds.length;
                  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
                  const radius = 24;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (percent / 100) * circumference;

                  return (
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        {/* Circular Progress Ring */}
                        <div className="relative flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r={radius}
                              className="stroke-neutral-200 dark:stroke-neutral-800"
                              strokeWidth="6"
                              fill="transparent"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r={radius}
                              className="stroke-blue-500 dark:stroke-blue-400 transition-all duration-1000 ease-out"
                              strokeWidth="6"
                              fill="transparent"
                              strokeLinecap="round"
                              style={{ strokeDasharray: circumference, strokeDashoffset }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-sm font-black text-neutral-900 dark:text-white leading-none">{percent}%</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1 uppercase tracking-wider">
                            Active Track
                          </h4>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium leading-tight line-clamp-2 mb-1.5">
                            {currentTrack.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                              {doneCount} / {totalCount} Modules
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 1. CAREER PATHWAYS / TRACKS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Certification Tracks ({tracks.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCourseSelection();
                      }}
                      className="text-[11px] font-semibold text-[#0078D4] dark:text-[#2899F5] hover:underline"
                    >
                      Change Goal
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {tracks.map((track) => {
                      const isSelected = track.id === selectedDomain;
                      const trackModIds = track.certifications.flatMap((c) => c.modules.map((m) => m.id));
                      const doneCount = trackModIds.filter((id) => completedModuleIds.includes(id)).length;
                      const percent = trackModIds.length > 0 ? Math.round((doneCount / trackModIds.length) * 100) : 0;

                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => {
                            onSelectDomain(track.id);
                            onClose();
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-[#0078D4] dark:text-[#2899F5] font-bold shadow-xs'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 shadow-xs flex-shrink-0">
                              {getDomainIcon(track.icon)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{track.name}</p>
                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                                {track.certifications.map((c) => c.code).join(' ➔ ')}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="text-[11px] font-bold">{percent}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. VIEW SWITCHER */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                    Learning Layout
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSetViewMode('roadmap');
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        viewMode === 'roadmap'
                          ? 'border-[#0078D4] bg-blue-50/80 dark:bg-blue-950/60 text-[#0078D4] dark:text-[#2899F5]'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <Map className="w-4 h-4" />
                      <span>Visual Roadmap</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSetViewMode('curriculum');
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        viewMode === 'curriculum'
                          ? 'border-[#0078D4] bg-blue-50/80 dark:bg-blue-950/60 text-[#0078D4] dark:text-[#2899F5]'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>All Modules</span>
                    </button>
                  </div>
                </div>

                {/* 3. STUDY SUITE & AI TOOLS */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                    Study Suite & Features
                  </span>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('toggle-copilot'));
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-between text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2.5">
                        <InteractiveCopilotAvatar size="sm" gender={userProfile.gender} />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">Microsoft Copilot AI</p>
                          <p className="text-[10px] text-neutral-500">Interactive architecture tutor & quizzes</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-neutral-500">
                        Ctrl+K
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAnalyticsModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-between text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">Exam Readiness & XP</p>
                          <p className="text-[10px] text-neutral-500">Analytics, milestones & badges</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-neutral-500">
                        Ctrl+A
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenShortcutsModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-between text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                          <Keyboard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">Keyboard Shortcuts</p>
                          <p className="text-[10px] text-neutral-500">Quick action command list</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-neutral-500">
                        ?
                      </span>
                    </button>
                  </div>
                </div>

                {/* 4. OFFICIAL MICROSOFT DOCS & LAB LINKS */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                    Official Microsoft Resources
                  </span>

                  <div className="space-y-1 text-xs">
                    <a
                      href="https://learn.microsoft.com/en-us/credentials/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#0078D4]" />
                        <span>Microsoft Credentials & Certifications</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>

                    <a
                      href="https://learn.microsoft.com/en-us/azure/architecture/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Cloud className="w-3.5 h-3.5 text-blue-500" />
                        <span>Azure Architecture Center Reference</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>

                    <a
                      href="https://learn.microsoft.com/en-us/azure/well-architected/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Azure Well-Architected Framework</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>

                    <a
                      href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Cloud Adoption Framework (CAF)</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Footer with Quick Theme Toggle & Settings */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 transition-colors"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 text-neutral-600" /> : theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-fuchsia-400" />}
                  <span>{theme === 'light' ? 'Dark Theme' : theme === 'dark' ? 'Neon Theme' : 'Light Theme'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettingsModal();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0078D4] text-white font-bold hover:bg-[#006cbd] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Preferences</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
