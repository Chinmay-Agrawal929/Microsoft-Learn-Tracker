import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, Award, Compass, Lightbulb, Clock } from 'lucide-react';
import { SmartNotification } from '../types';

interface SmartNotificationModalProps {
  notification: SmartNotification | null;
  onClose: () => void;
  onExploreModule: () => void;
}

export const SmartNotificationModal: React.FC<SmartNotificationModalProps> = ({
  notification,
  onClose,
  onExploreModule,
}) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Card Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 overflow-hidden z-10"
        >
          {/* Ambient luminous glow top banner */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Title */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0078D4] to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Microsoft AI Milestone Copilot
            </span>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">
            {notification.title}
          </h3>

          <div className="mt-4 p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 space-y-3">
            <div className="flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                {notification.motivationalNote}
              </p>
            </div>

            <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/40 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-600 dark:text-neutral-300">
                <strong className="text-neutral-900 dark:text-white">Why this matters: </strong>
                {notification.whyItMatters}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {notification.recommendedTime}
            </span>
            <span className="text-neutral-400">Track: {notification.certCode}</span>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Continue Roadmapping
            </button>

            <button
              onClick={() => {
                onClose();
                onExploreModule();
              }}
              className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0078D4] hover:bg-[#0068B8] shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Module</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
