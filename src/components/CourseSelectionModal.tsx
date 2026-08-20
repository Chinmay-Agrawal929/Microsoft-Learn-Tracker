import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Compass, CheckCircle2, ArrowRight, Cloud, Brain, ShieldCheck,
  Database, GitBranch, Sparkles, Clock, Target, Award, BookOpen, Flame
} from 'lucide-react';
import { LearningTrack, DomainId } from '../types';

interface CourseSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: LearningTrack[];
  selectedDomain: DomainId;
  onSelectTrack: (trackId: DomainId, targetGoal?: { certId: string; targetDate: string }) => void;
}

export const CourseSelectionModal: React.FC<CourseSelectionModalProps> = ({
  isOpen,
  onClose,
  tracks,
  selectedDomain,
  onSelectTrack,
}) => {
  const [activeTrackId, setActiveTrackId] = useState<DomainId>(selectedDomain);
  const [dailyCommitment, setDailyCommitment] = useState<'30m' | '1h' | '2h'>('1h');
  const [targetTimelineMonths, setTargetTimelineMonths] = useState<number>(2);

  if (!isOpen) return null;

  const currentTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  const handleConfirmTrack = () => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + targetTimelineMonths);

    const firstCert = currentTrack.certifications[0];
    onSelectTrack(activeTrackId, {
      certId: firstCert?.id || 'az-900',
      targetDate: targetDate.toISOString().split('T')[0],
    });
    onClose();
  };

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Database':
        return <Database className="w-5 h-5" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-5 sm:p-7 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0078D4] dark:text-[#2899F5]">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Choose Your Certification Track
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Select your target Microsoft Cloud career objective to personalize roadmap & labs.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Tracks Card Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                1. Select Primary Learning Track
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {tracks.map((track) => {
                  const isSelected = track.id === activeTrackId;
                  const totalModules = track.certifications.reduce((sum, c) => sum + c.modules.length, 0);

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setActiveTrackId(track.id)}
                      className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-blue-950/50 border-[#0078D4] dark:border-[#2899F5] shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`p-2 rounded-lg ${
                              isSelected
                                ? 'bg-[#0078D4] text-white'
                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                            }`}
                          >
                            {getDomainIcon(track.badgeIcon)}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#0078D4] text-white flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                          {track.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {track.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700/80 text-[10px] text-neutral-500">
                        <span>{track.certifications.length} Certs</span>
                        <span>•</span>
                        <span>{totalModules} Modules</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Track Details & Certification Pathway Preview */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  Pathway Progression: {currentTrack.name}
                </span>
                <span className="text-xs text-[#0078D4] dark:text-[#2899F5] font-semibold">
                  Official Microsoft Learn Curriculum
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {currentTrack.certifications.map((cert, idx) => (
                  <div key={cert.id} className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center gap-1.5">
                      <span className="font-bold text-neutral-900 dark:text-white">{cert.code}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-[#0078D4] dark:text-[#2899F5] font-semibold">
                        {cert.level}
                      </span>
                    </div>
                    {idx < currentTrack.certifications.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Target Daily Pace & Timeline Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  2. Daily Study Commitment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '30m', label: '30 mins/day', desc: 'Casual Pace' },
                    { id: '1h', label: '1 hour/day', desc: 'Standard Pace' },
                    { id: '2h', label: '2 hours/day', desc: 'Accelerated' },
                  ].map((pace) => (
                    <button
                      key={pace.id}
                      type="button"
                      onClick={() => setDailyCommitment(pace.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        dailyCommitment === pace.id
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight">{pace.label}</p>
                      <p className="text-[10px] opacity-70 mt-0.5">{pace.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  3. Target Timeline Goal
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 6].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setTargetTimelineMonths(months)}
                      className={`flex-1 py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                        targetTimelineMonths === months
                          ? 'bg-[#0078D4] text-white border-[#0078D4] shadow-xs'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {months} {months === 1 ? 'Month' : 'Months'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Cancel
            </button>

            <button
              id="confirm-course-goal-button"
              type="button"
              onClick={handleConfirmTrack}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] active:bg-[#005ba3] text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Set as Active Career Goal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
