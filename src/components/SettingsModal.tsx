import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Zap, Volume2, VolumeX, Target, RotateCcw, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserProgressState, Certification } from '../types';
import { AvatarPicker } from './AvatarPicker';

interface SettingsModalProps {
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onToggleTheme: () => void; onSetTheme?: (t: string) => void;
  profile: UserProfile;
  progress: UserProgressState;
  allCerts: Certification[];
  onSetTargetGoal: (certId: string, targetDate: string) => void;
  onResetProgress: () => void;
  onUpdateProfile?: (profile: Partial<UserProfile>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled = true,
  onToggleSound,
  isOpen,
  onClose,
  theme,
  onToggleTheme, onSetTheme,
  profile,
  progress,
  allCerts,
  onSetTargetGoal,
  onResetProgress,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [selectedCertId, setSelectedCertId] = useState(progress.targetGoal?.certId || 'az-104');
  const [targetDate, setTargetDate] = useState(progress.targetGoal?.targetDate || '2026-09-30');
  const [isExported, setIsExported] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(profile.avatarUrl);

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onSetTargetGoal(selectedCertId, targetDate);
    if (onUpdateProfile && currentAvatar !== profile.avatarUrl) {
      onUpdateProfile({ avatarUrl: currentAvatar });
    }
    onClose();
  };

  const handleAvatarChange = (newUrl: string) => {
    setCurrentAvatar(newUrl);
    if (onUpdateProfile) {
      onUpdateProfile({ avatarUrl: newUrl });
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({
      profile,
      progress,
      exportedAt: new Date().toISOString(),
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (profile.name || 'user').toLowerCase().replace(/[^a-z0-9]/gi, '-');
    a.download = `microsoft-learn-roadmap-${safeName}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Application & Learning Settings
            </h3>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-5 space-y-6">
            {/* Profile Avatar & Custom Photo Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Profile Avatar & Photo
              </label>
              <AvatarPicker
                currentAvatarUrl={currentAvatar}
                onSelectAvatar={handleAvatarChange}
              />
            </div>

            
            {/* Theme & Display Settings */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Appearance & Theme Switch
              </label>
              <div className="grid grid-cols-4 gap-2">
                {/* Light */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'light') { onSetTheme ? onSetTheme('light') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'light'
                      ? 'border-[#0078D4] bg-blue-50/60 dark:bg-blue-950/40 text-[#0078D4] font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center shadow-sm">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Light</span>
                </button>

                {/* Dark */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'dark') { onSetTheme ? onSetTheme('dark') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'dark'
                      ? 'border-[#0078D4] bg-blue-50/60 dark:bg-blue-950/40 text-blue-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-sm">
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Dark</span>
                </button>

                {/* Neon */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'neon') { onSetTheme ? onSetTheme('neon') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'neon'
                      ? 'border-fuchsia-500 bg-fuchsia-950/40 text-fuchsia-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#0f0518] border border-fuchsia-500/50 flex items-center justify-center shadow-[0_0_8px_rgba(255,0,255,0.3)]">
                    <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Neon</span>
                </button>
                
                {/* Classic Blue */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-classic') { onSetTheme ? onSetTheme('chrome-classic') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'chrome-classic'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Classic</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2">
                {/* Midnight */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-midnight') { onSetTheme ? onSetTheme('chrome-midnight') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'chrome-midnight'
                      ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-indigo-500/50 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Midnight</span>
                </button>

                {/* Mint */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-mint') { onSetTheme ? onSetTheme('chrome-mint') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'chrome-mint'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Mint</span>
                </button>

                {/* Rose */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-rose') { onSetTheme ? onSetTheme('chrome-rose') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'chrome-rose'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Rose</span>
                </button>

                {/* Lavender */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-lavender') { onSetTheme ? onSetTheme('chrome-lavender') : onToggleTheme(); }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors ${
                    theme === 'chrome-lavender'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Lavender</span>
                </button>
              </div>
            </div>

            {/* Target Certification Goal */}
            <form onSubmit={handleSaveGoal} className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Primary Certification Target
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={selectedCertId}
                  onChange={(e) => setSelectedCertId(e.target.value)}
                  className="text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                >
                  {allCerts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </form>

            {/* Data Management & Export */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Data Persistence & Export
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExported ? 'Exported JSON ✓' : 'Export Progress JSON'}</span>
                </button>

                <button
                  type="button"
                  onClick={onResetProgress}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0078D4] hover:bg-[#0068B8]"
            >
              Save & Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
