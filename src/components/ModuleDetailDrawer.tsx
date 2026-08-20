import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle2, ExternalLink, Sparkles, Clock, BookOpen, Plus, Trash2,
  Edit2, Check, HelpCircle, Save, Flame, Award, Tag, AlertCircle,
  ShieldCheck, Cpu, Copy, Bot, Lightbulb, Compass, FileCode2
} from 'lucide-react';
import { Module, Certification, UserCustomTask } from '../types';
import { InteractiveCopilotAvatar } from './InteractiveCopilotAvatar';

interface ModuleDetailDrawerProps {
  userGender?: 'male' | 'female' | 'unspecified';
  module: Module | null;
  certification: Certification | null;
  isCompleted: boolean;
  completedTaskIds: string[];
  customTasks: UserCustomTask[];
  moduleNotes: string;
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onToggleCompleteModule: (moduleId: string) => void;
  onAddCustomTask: (task: { title: string; moduleId: string; certId: string; priority: 'low' | 'medium' | 'high'; dueDate?: string }) => void;
  onUpdateCustomTask: (id: string, updates: Partial<UserCustomTask>) => void;
  onDeleteCustomTask: (id: string) => void;
  onSaveNotes: (moduleId: string, notes: string) => void;
  onOpenQuiz: (module: Module, cert: Certification) => void;
}

export const ModuleDetailDrawer: React.FC<ModuleDetailDrawerProps> = ({
  userGender,
  module,
  certification,
  isCompleted,
  completedTaskIds,
  customTasks,
  moduleNotes,
  onClose,
  onToggleTask,
  onToggleCompleteModule,
  onAddCustomTask,
  onUpdateCustomTask,
  onDeleteCustomTask,
  onSaveNotes,
  onOpenQuiz,
}) => {
  if (!module || !certification) return null;

  const [notesText, setNotesText] = useState(moduleNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  // New Custom Task input state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Editing existing task
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewTitle((prev) => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  useEffect(() => {
    setNotesText(moduleNotes || '');
  }, [moduleNotes, module.id]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesText(e.target.value);
    setIsNotesSaved(false);
  };

  const handleSaveNotes = () => {
    onSaveNotes(module.id, notesText);
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddCustomTask({
      title: newTitle.trim(),
      moduleId: module.id,
      certId: certification.id,
      priority: newPriority,
      dueDate: newDueDate.trim() || undefined,
    });

    setNewTitle('');
    setNewDueDate('');
    setShowAddForm(false);
  };

  const startEditTask = (task: UserCustomTask) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEditTask = (id: string) => {
    if (editingTitle.trim()) {
      onUpdateCustomTask(id, { title: editingTitle.trim() });
    }
    setEditingTaskId(null);
  };

  const [copiedAiContext, setCopiedAiContext] = useState(false);

  const handleCopyAiContext = () => {
    const aiContext = `### [MICROSOFT LEARN AI KNOWLEDGE PACKET]
Course Certification: ${certification.code} - ${certification.title} (${certification.level} Level)
Module Title: ${module.title}
Estimated Duration: ${module.estimatedMinutes} minutes | XP Reward: ${module.xp}
Skills Covered: ${module.skillsCovered.join(', ')}

[OVERVIEW]
${module.description}

${module.architectureTip ? `[ARCHITECTURE BEST PRACTICE]\n${module.architectureTip}\n` : ''}
${module.examTip ? `[EXAM TRAP & KEY FORMULA]\n${module.examTip}\n` : ''}
${module.scenarioStudy ? `[REAL-WORLD ENTERPRISE SCENARIO]\n${module.scenarioStudy}\n` : ''}
${module.cheatSheet && module.cheatSheet.length > 0 ? `[CORE CHEATSHEET POINTS]\n${module.cheatSheet.map(item => `* ${item}`).join('\n')}\n` : ''}

[OFFICIAL LEARNING UNITS]
${module.tasks.map((t, idx) => `${idx + 1}. [${t.type.toUpperCase()}] ${t.title} (${t.durationMinutes}m)`).join('\n')}

Microsoft Learn URL: ${module.learnUrl}`;

    navigator.clipboard.writeText(aiContext);
    setCopiedAiContext(true);
    setTimeout(() => setCopiedAiContext(false), 2200);
  };

  const handleAskCopilotAboutModule = () => {
    window.dispatchEvent(new CustomEvent('toggle-copilot'));
  };

  const moduleCustomTasks = customTasks.filter(t => t.moduleId === module.id);
  const officialTasksCompleted = module.tasks.filter(t => completedTaskIds.includes(t.id)).length;
  const allTasksCount = module.tasks.length + moduleCustomTasks.length;
  const allCompletedCount = officialTasksCompleted + moduleCustomTasks.filter(t => t.completed).length;
  const progressPercent = allTasksCount > 0 ? Math.round((allCompletedCount / allTasksCount) * 100) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-2xl h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col z-10 overflow-y-auto"
        >
          {/* Top Header */}
          <div className="sticky top-0 z-20 backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#0078D4] text-white">
                  {certification.code}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Unit {module.order}
                </span>
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mt-1.5 leading-snug">
                {module.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-8 flex-1">
            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 text-center">
              <div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Duration</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  {module.estimatedMinutes} mins
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">XP Reward</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  +{module.xp} XP
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Progress</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {progressPercent}%
                </p>
              </div>
            </div>

            {/* Description & Skills */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Overview & Learning Objectives
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {module.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {module.skillsCovered.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50"
                  >
                    <Tag className="w-3 h-3 text-blue-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons: Direct MS Learn Link, AI Quiz, & Copilot Deep Dive */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={module.learnUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0078D4] hover:bg-[#0068B8] shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Launch on Microsoft Learn</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => onOpenQuiz(module, certification)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>AI Practice Quiz</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAiContext}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 transition-colors"
                title="Copy structured machine-readable knowledge context for AI models or LLMs"
              >
                {copiedAiContext ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                <span>{copiedAiContext ? 'Copied for AI ✓' : 'AI Context'}</span>
              </button>
            </div>

            {/* AI Architecture Tip Card */}
            {module.architectureTip && (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0078D4] dark:text-[#2899F5] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#0078D4] dark:text-[#2899F5]" />
                  <span>Azure Well-Architected Framework Insight</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-mono sm:font-sans bg-white/60 dark:bg-neutral-900/60 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/60">
                  {module.architectureTip}
                </p>
              </div>
            )}

            {/* Exam Trap & High-Yield Strategy Card */}
            {module.examTip && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Exam Strategy & Key Distinction</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {module.examTip}
                </p>
              </div>
            )}

            {/* Real-World Case Study Scenario */}
            {module.scenarioStudy && (
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Enterprise Real-World Scenario</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {module.scenarioStudy}
                </p>
              </div>
            )}

            {/* Cheatsheet Key Bullets */}
            {module.cheatSheet && module.cheatSheet.length > 0 && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  <FileCode2 className="w-4 h-4 text-emerald-500" />
                  <span>Quick Reference Cheat-Sheet</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 list-disc list-inside">
                  {module.cheatSheet.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Copilot Interactive Helper Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <InteractiveCopilotAvatar size="sm" gender={userGender} />
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">Have questions about this unit?</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Ask Copilot to explain architectural tradeoffs or CLI commands</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAskCopilotAboutModule}
                className="px-3 py-1.5 rounded-xl bg-[#0078D4] hover:bg-[#0068b8] text-white text-xs font-bold shadow-xs transition-colors flex-shrink-0"
              >
                Ask Copilot
              </button>
            </div>

            {/* Official Module Units & Micro-tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Official Learning Units ({officialTasksCompleted}/{module.tasks.length})
                </h3>
              </div>

              <div className="space-y-2">
                {module.tasks.map((task) => {
                  const completed = completedTaskIds.includes(task.id);
                  return (
                    <motion.div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        completed
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                          : 'bg-white dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                          completed
                            ? 'bg-emerald-500 text-white scale-105'
                            : 'border-2 border-neutral-300 dark:border-neutral-600 bg-transparent'
                        }`}
                      >
                        {completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm font-medium leading-tight transition-colors ${
                          completed
                            ? 'line-through text-neutral-400 dark:text-neutral-500'
                            : 'text-neutral-800 dark:text-neutral-200'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
                            {task.type === 'reading' ? '📖 Concept Reading' : task.type === 'lab' ? '💻 Hands-on Sandbox' : '✅ Knowledge Check'}
                          </span>
                          <span className="text-[10px] text-neutral-400">·</span>
                          <span className="text-[10px] text-neutral-400">{task.durationMinutes} mins</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Editable Custom User Tasks Section */}
            <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5 text-[#0078D4]" />
                    My Custom Study Tasks & Sandbox Checklist
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Add your personal goals, flashcard revisions, or interview prep questions.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#0078D4] text-white hover:bg-[#0068B8] transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Add Task Form */}
              {showAddForm && (
                <form onSubmit={handleCreateTask} className="p-3 mb-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <input
                    type="text"
                    placeholder="e.g. Practice Azure CLI az group create command..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4] outline-none"
                    autoFocus
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="text-xs p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Target Due Date (e.g. Tomorrow)"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="text-xs p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 placeholder-neutral-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newTitle.trim()}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-[#0078D4] text-white disabled:opacity-50"
                      >
                        Save Task
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Custom Tasks List */}
              <div className="space-y-2">
                {moduleCustomTasks.length === 0 && !showAddForm ? (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-2">
                    No custom micro-tasks added yet. Click &quot;Add Task&quot; above to add your own interview practice steps.
                  </p>
                ) : (
                  moduleCustomTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                        t.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 mr-2">
                        <button
                          type="button"
                          onClick={() => onUpdateCustomTask(t.id, { completed: !t.completed })}
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                            t.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-neutral-300 dark:border-neutral-600'
                          }`}
                        >
                          {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        {editingTaskId === t.id ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="text-xs p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex-1 border border-neutral-300 dark:border-neutral-600 outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEditTask(t.id)}
                              className="p-1 text-emerald-600 hover:text-emerald-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <p className={`text-xs font-medium ${
                              t.completed
                                ? 'line-through text-neutral-400 dark:text-neutral-500'
                                : 'text-neutral-800 dark:text-neutral-200'
                            }`}>
                              {t.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                              <span className={`capitalize font-semibold ${
                                t.priority === 'high' ? 'text-rose-500' : t.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                              }`}>
                                {t.priority}
                              </span>
                              {t.dueDate && <span>· Due: {t.dueDate}</span>}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {editingTaskId !== t.id && (
                          <button
                            onClick={() => startEditTask(t)}
                            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteCustomTask(t.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Private Interview & Study Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  Study Notes & Interview Cheat-Sheet
                </h3>
                <button
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0078D4] dark:text-[#2899F5] hover:underline"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isNotesSaved ? 'Saved ✓' : 'Save Note'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={notesText}
                onChange={handleNotesChange}
                placeholder="Write key architectural tradeoffs, commands (az cli, bicep), interview questions to remember..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0078D4] resize-none"
              />
            </div>
          </div>

          {/* Bottom Sticky Action Footer */}
          <div className="sticky bottom-0 z-20 backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 p-3.5 sm:p-4 pb-6 sm:pb-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                Reward: <strong className="text-blue-600 dark:text-blue-400">+{module.xp} XP</strong>
              </span>
            </div>

            <motion.button
              id="toggle-complete-module-button"
              onClick={() => onToggleCompleteModule(module.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md ${
                isCompleted
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{isCompleted ? 'Mark Incomplete' : 'Complete & Unlock Next'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
