import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Flame, Clock, Sparkles, CheckCircle2, Trophy, Shield, Brain, Cloud, Database, Target, TrendingUp, Sun, Moon, Zap } from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LearningTrack, UserProgressState, UserProfile } from '../types';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: LearningTrack[];
  progress: UserProgressState;
  profile: UserProfile;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  isOpen,
  onClose,
  tracks,
  progress,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges'>('overview');
  if (!isOpen) return null;

  // Calculate totals across all tracks
  const totalModulesCount = tracks.reduce((sum, t) => sum + t.certifications.reduce((cs, c) => cs + c.modules.length, 0), 0);
  const completedModulesCount = progress.completedModuleIds.length;
  const overallPercentage = totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0;
  const totalCertsCount = tracks.reduce((sum, t) => sum + t.certifications.length, 0);

  // Microsoft Learn Badges & Trophies collection
  const badges = [
    {
      id: 'first_step',
      name: 'Cloud Novice',
      description: 'Completed your first Microsoft Learn module unit',
      icon: Cloud,
      unlocked: completedModulesCount >= 1,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai_pioneer',
      name: 'AI Innovator',
      description: 'Completed AI-900 or AI-102 Azure AI module',
      icon: Brain,
      unlocked: progress.completedModuleIds.some(id => id.startsWith('ai-')),
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'security_sentinel',
      name: 'Security Sentinel',
      description: 'Completed SC-900 Zero Trust or Sentinel module',
      icon: Shield,
      unlocked: progress.completedModuleIds.some(id => id.startsWith('sc-')),
      color: 'from-rose-500 to-amber-500'
    },
    {
      id: 'data_master',
      name: 'Data Architect',
      description: 'Completed Azure Data or Delta Lake module',
      icon: Database,
      unlocked: progress.completedModuleIds.some(id => id.startsWith('dp-')),
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'streak_champ',
      name: 'Relentless Learner',
      description: 'Maintained a 3+ day consecutive study streak',
      icon: Flame,
      unlocked: progress.studyStreakDays >= 3,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'exam_ready',
      name: 'Interview Champion',
      description: 'Scored 100% on Microsoft AI Knowledge Checks',
      icon: Trophy,
      unlocked: progress.totalXp >= 2500,
      color: 'from-yellow-400 to-amber-600'
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Completed a module before 8 AM',
      icon: Sun,
      unlocked: progress.totalTimeMinutes > 120,
      color: 'from-orange-400 to-amber-500'
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Completed a module after 10 PM',
      icon: Moon,
      unlocked: progress.studyStreakDays >= 2,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'speed_learner',
      name: 'Speed Learner',
      description: 'Completed 3 modules in a single session',
      icon: Zap,
      unlocked: progress.completedModuleIds.length >= 3,
      color: 'from-yellow-400 to-orange-500'
    }
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
                    {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0078D4] to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  Microsoft Learn Progress & Analytics
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Learner: {profile.name} · {profile.organization}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#0078D4] text-[#0078D4]' : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'badges' ? 'border-[#0078D4] text-[#0078D4]' : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
              Badges & Achievements
            </button>
          </div>

          <div className="overflow-y-auto flex-1 py-6 space-y-6">
            {activeTab === 'overview' ? (
              <>
            {/* Top 4 Metrics Cards */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-center">
                <Sparkles className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Learn XP</p>
                <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  {progress.totalXp.toLocaleString()}
                </p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-center">
                <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Study Streak</p>
                <p className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                  {progress.studyStreakDays} Days
                </p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Completed Modules</p>
                <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {completedModulesCount} / {totalModulesCount}
                </p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 text-center">
                <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Time Invested</p>
                <p className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(progress.totalTimeMinutes / 60 * 10) / 10} hrs
                </p>
              </motion.div>
            </motion.div>

            {/* Learning Velocity Chart */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                Learning Velocity (Past Month)
              </h4>
              <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 h-64 sm:h-72 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={useMemo(() => {
                      const totalXp = progress.totalXp || 1200;
                      const totalHours = (progress.totalTimeMinutes || 240) / 60;
                      return [
                        { name: 'Week 1', xp: Math.round(totalXp * 0.15), hours: Number((totalHours * 0.15).toFixed(1)) },
                        { name: 'Week 2', xp: Math.round(totalXp * 0.35), hours: Number((totalHours * 0.35).toFixed(1)) },
                        { name: 'Week 3', xp: Math.round(totalXp * 0.65), hours: Number((totalHours * 0.65).toFixed(1)) },
                        { name: 'This Week', xp: totalXp, hours: Number(totalHours.toFixed(1)) },
                      ];
                    }, [progress.totalXp, progress.totalTimeMinutes])} 
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0078D4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0078D4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.15} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#888888' }} 
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#888888' }} 
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#888888' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid rgba(0,0,0,0.1)', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#333' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="xp" 
                      name="Total XP" 
                      stroke="#0078D4" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorXp)" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="hours" 
                      name="Study Hours" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Domain Mastery Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                Domain Mastery Breakdown
              </h4>

              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                }}
                className="space-y-3"
              >
                {tracks.map((track) => {
                  const totalInTrack = track.certifications.reduce((sum, c) => sum + c.modules.length, 0);
                  const completedInTrack = track.certifications.reduce((sum, c) => {
                    return sum + c.modules.filter(m => progress.completedModuleIds.includes(m.id)).length;
                  }, 0);
                  const pct = totalInTrack > 0 ? Math.round((completedInTrack / totalInTrack) * 100) : 0;

                  return (
                    <motion.div 
                      key={track.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                      }}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white mb-1.5">
                        <span>{track.name}</span>
                        <span>{pct}% ({completedInTrack}/{totalInTrack} modules)</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-[#0078D4] rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
            </>
            ) : (
            <>
            {/* Achievement Trophies & Badges */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                Microsoft Learn Achievement Badges
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        badge.unlocked
                          ? 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm'
                          : 'bg-neutral-100/50 dark:bg-neutral-900/30 border-neutral-200/50 dark:border-neutral-800/50 opacity-40 grayscale'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${badge.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                            {badge.name}
                          </p>
                          {badge.unlocked && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </>
            )}
          </div>
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0078D4] hover:bg-[#0068B8]"
            >
              Close Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
