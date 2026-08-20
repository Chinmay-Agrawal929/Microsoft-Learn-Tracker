import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, CheckCircle2, Lock, Sparkles, Clock, ExternalLink, ArrowRight, Play, BookOpen, Layers } from 'lucide-react';
import { LearningTrack, Module, Certification } from '../types';

interface CurriculumViewProps {
  currentTrack: LearningTrack;
  moduleStates: Record<string, 'completed' | 'available' | 'locked'>;
  completedTaskIds: string[];
  onSelectModule: (module: Module, cert: Certification) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  currentTrack,
  moduleStates,
  completedTaskIds,
  onSelectModule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'completed' | 'locked'>('all');

  const allModulesWithCert = currentTrack.certifications.flatMap(cert =>
    cert.modules.map(mod => ({
      ...mod,
      cert,
      state: moduleStates[mod.id] || 'locked',
    }))
  );

  const filtered = allModulesWithCert.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cert.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skillsCovered.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || item.state === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search modules, skills, AZ codes (e.g., RBAC, Docker, AZ-104)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'available', 'completed', 'locked'] as const).map(status => (
            <motion.button
              key={status}
              onClick={() => setStatusFilter(status)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modules List Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50"
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">No modules found matching your query.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const completedTasks = item.tasks.filter(t => completedTaskIds.includes(t.id)).length;
              const isClickable = item.state !== 'locked';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                  whileHover={isClickable ? { y: -2, transition: { duration: 0.15 } } : {}}
                  onClick={() => {
                    if (isClickable) onSelectModule(item, item.cert);
                  }}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${
                    item.state === 'completed'
                      ? 'bg-white dark:bg-neutral-900 border-emerald-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-400'
                      : item.state === 'available'
                      ? 'bg-white dark:bg-neutral-900 border-blue-200 dark:border-blue-900/60 shadow-sm hover:border-blue-400 hover:shadow-md'
                      : 'bg-neutral-100/60 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 opacity-60'
                  } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        item.state === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : item.state === 'available'
                          ? 'bg-[#0078D4] text-white'
                          : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {item.state === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : item.state === 'locked' ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        item.order
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          {item.cert.code}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                            item.state === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : item.state === 'available'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {item.state}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.estimatedMinutes}m
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        {item.xp} XP
                      </span>
                      <span className="hidden sm:inline">
                        {completedTasks}/{item.tasks.length} tasks
                      </span>
                    </div>

                    {isClickable && (
                      <button
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <span>Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
