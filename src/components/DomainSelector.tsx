import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Brain, ShieldCheck, Database, GitBranch, Sparkles } from 'lucide-react';
import { LearningTrack, DomainId } from '../types';

interface DomainSelectorProps {
  tracks: LearningTrack[];
  selectedDomain: DomainId;
  onSelectDomain: (id: DomainId) => void;
  completedModuleIds: string[];
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  tracks,
  selectedDomain,
  onSelectDomain,
  completedModuleIds,
}) => {
  const getIcon = (badgeIcon: string) => {
    switch (badgeIcon) {
      case 'Cloud':
        return <Cloud className="w-4 h-4" />;
      case 'Brain':
        return <Brain className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'GitBranch':
        return <GitBranch className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      {/* Scrollable pill tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {tracks.map((track) => {
          const isSelected = track.id === selectedDomain;
          // Calculate track progress
          const totalModules = track.certifications.reduce((sum, cert) => sum + cert.modules.length, 0);
          const completedInTrack = track.certifications.reduce((sum, cert) => {
            return sum + cert.modules.filter(m => completedModuleIds.includes(m.id)).length;
          }, 0);
          const percent = totalModules > 0 ? Math.round((completedInTrack / totalModules) * 100) : 0;

          return (
            <motion.button
              key={track.id}
              id={`domain-tab-${track.id}`}
              onClick={() => onSelectDomain(track.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className={`group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 border min-h-[44px] ${
                isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-neutral-900/90 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
              }`}
            >
              <span
                className={`p-1.5 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-white/20 dark:bg-neutral-900/20 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:text-blue-500'
                }`}
              >
                {getIcon(track.badgeIcon)}
              </span>

              <span>{track.name}</span>

              {/* Progress mini indicator */}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  isSelected
                    ? 'bg-white/25 text-white dark:bg-neutral-900/25 dark:text-neutral-900'
                    : percent === 100
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : percent > 0
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}
              >
                {percent}%
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
