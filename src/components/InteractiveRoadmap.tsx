import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2, Lock, ArrowRight, ExternalLink, Sparkles,
  Clock, BookOpen, Layers, Award, Play, ChevronRight, Zap
} from 'lucide-react';
import { Certification, Module, DomainId } from '../types';

interface InteractiveRoadmapProps {
  certifications: Certification[];
  moduleStates: Record<string, 'completed' | 'available' | 'locked'>;
  certStates: Record<string, 'completed' | 'available' | 'locked'>;
  completedTaskIds: string[];
  onSelectModule: (module: Module, cert: Certification) => void;
  onSelectCert: (cert: Certification) => void;
}

export const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({
  certifications,
  moduleStates,
  certStates,
  completedTaskIds,
  onSelectModule,
  onSelectCert,
}) => {
  return (
    <div className="w-full space-y-10 sm:space-y-14 relative pb-16">
      {certifications.map((cert, certIndex) => {
        const certState = certStates[cert.id] || 'available';
        const completedModulesCount = cert.modules.filter(m => moduleStates[m.id] === 'completed').length;
        const totalModules = cert.modules.length;
        const certProgressPercent = Math.round((completedModulesCount / totalModules) * 100);

        return (
          <div key={cert.id} className="relative">
            {/* Animated Connector Wire to Next Certification */}
            {certIndex < certifications.length - 1 && (
              <div className="absolute left-8 sm:left-10 top-full h-10 sm:h-14 w-1 -translate-x-1/2 z-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <motion.div
                  className="w-full h-full bg-gradient-to-b from-[#0078D4] via-[#6366F1] to-[#00A4EF]"
                  initial={{ y: '-100%' }}
                  animate={{ y: certState === 'completed' ? '0%' : '100%' }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            )}

            {/* Certification Header Card Node */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: certIndex * 0.08 }}
              className={`relative rounded-2xl border p-4 sm:p-6 transition-all duration-300 backdrop-blur-xs ${
                certState === 'completed'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm'
                  : certState === 'available'
                  ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-md hover:border-blue-300 dark:hover:border-blue-800/80 ring-1 ring-black/5 dark:ring-white/5'
                  : 'bg-neutral-100/70 dark:bg-neutral-900/40 border-neutral-200/80 dark:border-neutral-800/60 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Certification Badge / Status Indicator */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm transition-all ${
                      certState === 'completed'
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : certState === 'available'
                        ? 'bg-[#0078D4] text-white shadow-blue-500/20 ring-4 ring-blue-100 dark:ring-blue-950'
                        : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {certState === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : certState === 'locked' ? (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 tracking-wider">
                        {cert.code}
                      </span>
                      <span
                        className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                          cert.level === 'Fundamentals'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                            : cert.level === 'Associate'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {cert.level}
                      </span>

                      {certState === 'completed' && (
                        <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Ready
                        </span>
                      )}

                      {certState === 'locked' && (
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Prereqs: {cert.prerequisites.join(', ').toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-1">
                      {cert.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-0.5 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </div>

                {/* Right side stats & Microsoft Learn Official Link */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Progress</p>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                      {completedModulesCount}/{totalModules} Modules ({certProgressPercent}%)
                    </p>
                  </div>

                  <a
                    href={cert.learnUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0078D4] dark:text-[#2899F5] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors border border-blue-200 dark:border-blue-900/50 min-h-[36px]"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Progress bar across cert */}
              <div className="mt-4 w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all ${
                    certProgressPercent === 100 ? 'bg-emerald-500' : 'bg-[#0078D4]'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${certProgressPercent}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>

            {/* Modules Roadmap Grid / Branching Tree under Cert */}
            <div className="mt-4 pl-0 sm:pl-8 relative">
              {/* Vertical connector guide line on tablet/desktop */}
              <div className="hidden sm:block absolute left-4 top-0 bottom-6 w-0.5 bg-neutral-200 dark:bg-neutral-800 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 relative z-10 pt-1 sm:pt-2">
                {cert.modules.map((mod, modIdx) => {
                  const state = moduleStates[mod.id] || 'locked';
                  const completedTasksCount = mod.tasks.filter(t => completedTaskIds.includes(t.id)).length;
                  const totalTasks = mod.tasks.length;

                  return (
                    <motion.div
                      key={mod.id}
                      id={`module-card-${mod.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: modIdx * 0.04 }}
                      whileHover={state !== 'locked' ? { y: -3, scale: 1.01, transition: { duration: 0.2 } } : {}}
                      whileTap={state !== 'locked' ? { scale: 0.98 } : {}}
                      onClick={() => {
                        if (state !== 'locked') {
                          onSelectModule(mod, cert);
                        }
                      }}
                      className={`group relative rounded-xl border p-4 transition-all duration-200 text-left ${
                        state === 'completed'
                          ? 'bg-white dark:bg-neutral-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs hover:border-emerald-500 cursor-pointer'
                          : state === 'available'
                          ? 'bg-white dark:bg-neutral-900 border-blue-300 dark:border-blue-800/80 shadow-md ring-1 ring-blue-500/20 hover:border-blue-500 hover:shadow-lg cursor-pointer'
                          : 'bg-neutral-100/60 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800/60 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Status beacon pill */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              state === 'completed'
                                ? 'bg-emerald-500 text-white'
                                : state === 'available'
                                ? 'bg-blue-500 text-white animate-pulse'
                                : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : state === 'locked' ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              mod.order
                            )}
                          </span>

                          <span
                            className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              state === 'completed'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : state === 'available'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {state === 'completed' ? 'Completed' : state === 'available' ? 'Available' : 'Locked'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {mod.estimatedMinutes}m
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            +{mod.xp} XP
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white group-hover:text-[#0078D4] dark:group-hover:text-[#2899F5] transition-colors leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {mod.skillsCovered.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {totalTasks > 0 ? `${completedTasksCount}/${totalTasks} Tasks` : 'Lab'}
                        </span>

                        {state === 'available' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0078D4] dark:text-[#2899F5] group-hover:translate-x-0.5 transition-transform">
                            Open Module <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}

                        {state === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Review <BookOpen className="w-3.5 h-3.5" />
                          </span>
                        )}

                        {state === 'locked' && (
                          <span className="text-neutral-400 dark:text-neutral-500 text-[11px]">
                            Prereq Required
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
