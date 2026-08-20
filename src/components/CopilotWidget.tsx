import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Trash2,
  ArrowUpRight, HelpCircle, Volume2, VolumeX, Copy, Check,
  Terminal, Compass, Lightbulb, ShieldCheck, Zap, Heart, Flame,
  Target, AlertTriangle, BookOpen, PlusCircle, CheckCircle2, Play
, Paperclip, Brain } from 'lucide-react';
import { CopilotMessage, Module, Certification, UserProgressState, StudyStrategyTip } from '../types';
import { InteractiveCopilotAvatar } from './InteractiveCopilotAvatar';

interface CopilotWidgetProps {
  userGender?: 'male' | 'female' | 'unspecified';
  currentModule: Module | null;
  currentCert: Certification | null;
  progress?: UserProgressState;
  onOpenQuiz?: (moduleId: string) => void;
  onAddTask?: (task: { title: string; moduleId?: string; certId?: string; priority: 'low' | 'medium' | 'high' }) => void;
  onOpenModule?: (moduleId: string) => void;
}

const CHEER_RESPONSES = [
  "🌟 **You are doing fantastic!**\n\nEvery single unit you complete is real progress toward your Microsoft Certification. Cloud architecture isn't learned overnight, but your consistency today puts you miles ahead. Keep that fire burning—you're going to ace this certification!",
  "🚀 **High five, Cloud Champion!**\n\nDid you know that regular daily study builds neural memory pathways that make technical scenario questions feel effortless on exam day? You've got the determination and focus. Let's conquer the next learning objective together!",
  "💎 **Proud of your effort!**\n\nThe cloud industry needs skilled architects like you who understand real-world solutions, security by design, and scalability. Take a deep breath, trust your preparation, and let's keep advancing!",
  "⚡ **Unstoppable Momentum!**\n\nYou're leveling up with every concept you review. Remember: every certified expert started right where you are now. Keep asking great questions, keep experimenting in the labs, and keep winning!"
];

export const CopilotWidget: React.FC<CopilotWidgetProps> = ({
  userGender,
  currentModule,
  currentCert,
  progress,
  onOpenQuiz,
  onAddTask,
  onOpenModule,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepReasoning, setIsDeepReasoning] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute struggle count from quiz attempts
  const quizAttempts = progress?.quizAttempts || [];
  const failedAttempts = quizAttempts.filter(a => !a.passed || (a.score / a.totalQuestions) < 0.7);
  const struggleCount = failedAttempts.length;

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'copilot',
      text: `Hello! I'm **Microsoft Copilot for Microsoft Learn**.

I'm connected to your active certification journey${currentCert ? ` for **${currentCert.code} - ${currentCert.title}**` : ''}.

Here are some ways I can assist your study:
* **🎯 Personalized Study Strategy**: AI diagnosis of your quiz failure patterns and exam traps.
* **Architecture Explanations**: Deep dive into Azure Well-Architected Framework, Zero Trust, and Microservices.
* **Exam Strategies**: Cheat sheets, scenario-based practice questions, and common trap choices.
* **CLI & PowerShell**: Instant scripts for deploying Virtual Networks, Managed Identities, and Azure OpenAI resources.

What would you like to explore right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🎯 Diagnose my quiz struggle patterns',
        'Explain Azure Zero Trust Architecture',
        'Compare Azure SQL Managed Instance vs Elastic Pool',
        'How does RAG work in Azure OpenAI Service?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce interactions to prevent rapid click conflicting state updates
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDebouncedToggle = useCallback((newState?: boolean) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setIsOpen(prev => {
        const nextState = newState !== undefined ? newState : !prev;
        if (nextState) {
          setTimeout(() => inputRef.current?.focus(), 150);
        }
        return nextState;
      });
    }, 250); // 250ms debounce
  }, []);


  // Listen for open-copilot-strategy event from QuizModal or elsewhere
  useEffect(() => {
    const handleOpenStrategy = (e: any) => {
      setIsOpen(true);
      const targetModId = e.detail?.moduleId;
      setTimeout(() => {
        handleFetchStudyStrategy(targetModId);
      }, 300);
    };

    window.addEventListener('open-copilot-strategy', handleOpenStrategy);
    return () => window.removeEventListener('open-copilot-strategy', handleOpenStrategy);
  }, [currentCert, currentModule, progress]);

  // Global toggle listener (Ctrl+K)
  useEffect(() => {
    const handleToggle = () => {
      handleDebouncedToggle();
    };
    window.addEventListener('toggle-copilot', handleToggle);
    return () => window.removeEventListener('toggle-copilot', handleToggle);
  }, [handleDebouncedToggle]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Speech synthesis handle
  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for voice
    const cleanText = text.replace(/[*_#`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddTaskFromStrategy = (strategy: StudyStrategyTip, index: number) => {
    if (!onAddTask) return;
    const taskId = `strat-${index}`;
    onAddTask({
      title: `Remediate: ${strategy.struggleModuleTitle} (${strategy.certCode})`,
      moduleId: strategy.moduleId,
      certId: currentCert?.id,
      priority: strategy.priority === 'critical' ? 'high' : 'medium',
    });
    setAddedTaskId(taskId);
    setTimeout(() => setAddedTaskId(null), 2500);
  };

  const handleFetchStudyStrategy = async (targetModuleId?: string) => {
    setIsLoading(true);

    const userPromptMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: targetModuleId
        ? `🎯 Please generate a personalized Study Strategy for my recent quiz mistakes on this module.`
        : `🎯 Please analyze my quiz failure patterns and give me a personalized Study Strategy.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userPromptMsg]);

    try {
      const res = await fetch('/api/copilot/study-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDeepReasoning,
          quizAttempts: progress?.quizAttempts || [],
          strugglingModuleIds: progress?.strugglingModuleIds || [],
          currentCert,
          currentModule,
        }),
      });

      const data = await res.json();
      const strategies: StudyStrategyTip[] = data.strategies || [];

      const copilotResponse: CopilotMessage = {
        id: `copilot-strat-${Date.now()}`,
        sender: 'copilot',
        text: data.summaryMarkdown || `Here is your customized Microsoft Learn study strategy:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        strategyData: strategies,
        isStrategyReport: true,
        suggestions: [
          'Give me a mnemonic to remember this',
          'Explain common exam traps for AZ-900',
          'Retake practice quiz now'
        ],
      };

      setMessages(prev => [...prev, copilotResponse]);
    } catch (err) {
      console.error('Failed to generate study strategy:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `copilot-strat-err-${Date.now()}`,
          sender: 'copilot',
          text: `### 🎯 Quick Study Strategy Recommendation\n\n* **Active Recall**: Review the difference between **Azure Availability Zones** (datacenter redundancy within the same region with <2ms latency) and **Region Pairs** (geographical disaster recovery >= 300 miles apart).\n* **Hands-on Sandbox**: Launch Azure CLI and practice creating zone-redundant storage accounts.\n* **Exam Trap**: Watch for questions asking for fault isolation within a SINGLE region—the answer is Availability Zones, not Region Pairs.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Retake practice quiz', 'Review Azure SLAs']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    // Check if the user query is asking for a study strategy or failure pattern analysis
    const lower = text.toLowerCase();
    if (lower.includes('study strategy') || lower.includes('failure pattern') || lower.includes('struggle') || lower.includes('diagnose my quiz') || lower.includes('weak area')) {
      setInputMessage('');
      return handleFetchStudyStrategy();
    }

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDeepReasoning,
          message: text.trim(),
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          currentModule,
          currentCert,
          quizAttempts: progress?.quizAttempts,
          strugglingModuleIds: progress?.strugglingModuleIds,
        }),
      });

      const data = await response.json();

      const copilotMsg: CopilotMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: data.reply || 'Here is the Microsoft Learn architecture breakdown for your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || [
          '🎯 Give me a personalized study strategy',
          'Quiz me on this module',
          'Explain key exam tradeoffs'
        ],
      };

      setMessages(prev => [...prev, copilotMsg]);
    } catch (err) {
      console.error('Copilot fetch error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `copilot-err-${Date.now()}`,
          sender: 'copilot',
          text: "I'm ready with your Microsoft Learn curriculum! Key concept to review: Remember Azure's Shared Responsibility Model—Security OF the Cloud (Microsoft) vs Security IN the Cloud (Customer).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['🎯 Give me a personalized study strategy', 'Explain Azure RBAC', 'AZ-900 Core Services']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheerMeUp = () => {
    const randomCheer = CHEER_RESPONSES[Math.floor(Math.random() * CHEER_RESPONSES.length)];
    const cheerMsg: CopilotMessage = {
      id: `copilot-cheer-${Date.now()}`,
      sender: 'copilot',
      text: randomCheer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🎯 Diagnose my quiz struggle patterns',
        'Give me an exam strategy tip',
        'Quiz me on current module'
      ]
    };
    setMessages(prev => [...prev, cheerMsg]);
    window.dispatchEvent(new CustomEvent('copilot-cheer', {
      detail: { message: "You're doing amazing! Let's keep that momentum! 🌟🚀" }
    }));
  };

  const clearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'copilot',
        text: 'Chat history reset. How can I help with your Azure & Microsoft certifications next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '🎯 Diagnose my quiz struggle patterns',
          'Azure Storage Tiers comparison',
          'Explain Zero Trust in Microsoft Security',
          'Delta Lake Medallion Architecture'
        ]
      }
    ]);
  };

  // Markdown & Code block renderer helper
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : 'sh';
        const code = (lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines.slice(1) : lines).join('\n');

        return (
          <div key={i} className="my-2.5 rounded-xl overflow-hidden border border-neutral-700/80 bg-neutral-950 text-neutral-100 font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>{language}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(`code-${i}`, code)}
                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"
              >
                {copiedId === `code-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === `code-${i}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format headings, bullet lines and bold text
      const lines = part.split('\n');
      return (
        <div key={i} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1.5" />;

            if (line.trim().startsWith('### ')) {
              return (
                <h4 key={lIdx} className="text-sm font-bold text-[#0078D4] dark:text-[#2899F5] pt-1">
                  {line.trim().replace('### ', '')}
                </h4>
              );
            }

            const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
            const cleanedLine = isBullet ? line.trim().substring(2) : line;

            // Render bold segments
            const segments = cleanedLine.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={lIdx} className={`text-xs leading-relaxed ${isBullet ? 'pl-3 relative before:content-["•"] before:absolute before:left-0 before:text-[#0078D4] dark:before:text-[#2899F5]' : ''}`}>
                {segments.map((seg, sIdx) => {
                  if (seg.startsWith('**') && seg.endsWith('**')) {
                    return <strong key={sIdx} className="font-bold text-neutral-900 dark:text-white">{seg.slice(2, -2)}</strong>;
                  }
                  return seg;
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-20 right-3 z-40 sm:bottom-6 sm:right-6">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="copilot-floating-button"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDebouncedToggle(true)}
            className="group relative flex items-center gap-2 pl-2 pr-3.5 py-2 sm:pl-2.5 sm:pr-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0078D4] via-[#7B2CBF] to-[#00A4EF] text-white shadow-xl shadow-purple-900/25 hover:shadow-2xl transition-all duration-300 border border-white/30"
          >
            {/* Interactive Eye Tracking Avatar */}
            <InteractiveCopilotAvatar size="sm" gender={userGender} enableInteractivePokes={false} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold tracking-wide leading-tight">Copilot</span>
                {struggleCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-neutral-900 text-[9px] font-black uppercase tracking-tight animate-pulse">
                    Strategy Ready
                  </span>
                )}
              </div>
              <span className="text-[9px] text-cyan-200 font-medium leading-none">AI Study Coach</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Copilot Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="copilot-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isExpanded ? 'min(94vw, 760px)' : 'min(94vw, 460px)',
              height: isExpanded ? 'min(88vh, 760px)' : 'min(82vh, 620px)',
            }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed sm:static bottom-16 right-2 sm:bottom-0 sm:right-0 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl z-50"
          >
            {/* Header with Copilot Iridescent Aura */}
            <div className="p-3.5 px-4 bg-gradient-to-r from-[#0078D4] via-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-between shadow-sm relative overflow-hidden">
              {/* Shimmer line */}
              <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse pointer-events-none" />

              <div className="flex items-center gap-2.5 z-10">
                <InteractiveCopilotAvatar size="md" isThinking={isLoading} gender={userGender} />
                <div>
                  <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                    Microsoft Copilot
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-medium">
                      AI Study Coach
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/80 leading-tight">
                    {currentCert ? `${currentCert.code} Certified Coach` : 'Azure Cloud & AI Mentor'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 z-10">
                {/* Dedicated Study Strategy Button */}
                <button
                  type="button"
                  onClick={() => handleFetchStudyStrategy()}
                  title="Generate personalized study strategy from your quiz failure patterns"
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 flex items-center gap-1 transition-all active:scale-95 shadow-xs relative"
                >
                  <Target className="w-3.5 h-3.5 text-cyan-200" />
                  <span className="hidden sm:inline">Strategy</span>
                  {struggleCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-purple-600 animate-ping" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCheerMeUp}
                  title="Cheer me up! Get instant encouragement"
                  className="p-1.5 rounded-lg text-amber-200 hover:text-amber-100 hover:bg-white/15 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-amber-300/30 text-amber-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Normal size' : 'Expand window'}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDebouncedToggle(false)}
                  title="Close Copilot"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-Header Banner if Quiz Failure Patterns Detected */}
            {struggleCount > 0 && (
              <div className="px-4 py-2 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 border-b border-amber-300/40 dark:border-amber-700/40 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-medium text-[11px] leading-tight">
                    <strong>{struggleCount} Quiz Pattern{struggleCount > 1 ? 's' : ''} Identified:</strong> Customized remediation strategy ready.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFetchStudyStrategy()}
                  className="text-[11px] font-bold text-[#0078D4] dark:text-cyan-300 hover:underline whitespace-nowrap"
                >
                  View Strategy &rarr;
                </button>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'copilot' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0078D4] to-[#8B5CF6] text-white flex-shrink-0 flex items-center justify-center shadow-xs mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[92%] sm:max-w-[88%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#0078D4] text-white rounded-tr-xs'
                          : 'bg-white dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 rounded-tl-xs'
                      }`}
                    >
                      {msg.sender === 'copilot' ? renderMessageContent(msg.text) : <p>{msg.text}</p>}

                      {/* Interactive Strategy Cards if this message has structured strategy data */}
                      {msg.strategyData && msg.strategyData.length > 0 && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            <span>Actionable Remediation Modules ({msg.strategyData.length})</span>
                          </p>

                          {msg.strategyData.map((strat, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3 rounded-xl border border-purple-200/80 dark:border-purple-800/70 bg-purple-50/30 dark:bg-purple-950/20 space-y-2.5"
                            >
                              {/* Title & Priority Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0078D4] text-white">
                                    {strat.certCode}
                                  </span>
                                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                                    {strat.struggleModuleTitle}
                                  </h5>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  strat.priority === 'critical'
                                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/60'
                                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/60'
                                }`}>
                                  {strat.priority === 'critical' ? 'High Focus' : 'Moderate'}
                                </span>
                              </div>

                              {/* Root Cause Analysis */}
                              <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 text-xs">
                                <p className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 mb-1 text-purple-600 dark:text-purple-400">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Failure Pattern Diagnosis</span>
                                </p>
                                <p className="text-neutral-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                                  {strat.rootCauseAnalysis}
                                </p>
                              </div>

                              {/* Exam Trap Alert */}
                              <div className="p-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/60 dark:border-amber-700/60 text-xs">
                                <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-0.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                  <span>Exam Trap to Avoid</span>
                                </p>
                                <p className="text-amber-900/90 dark:text-amber-200/90 text-[11px] leading-relaxed">
                                  {strat.examTrapAlert.replace(/⚠️ \*\*Exam Pitfall\*\*:\s*/, '')}
                                </p>
                              </div>

                              {/* CLI Command if present */}
                              {strat.quickReviewCommand && (
                                <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 font-mono text-[11px]">
                                  <div className="flex items-center justify-between px-2.5 py-1 bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400">
                                    <span className="flex items-center gap-1 text-cyan-400">
                                      <Terminal className="w-3 h-3" />
                                      <span>Hands-on Drill</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(`cmd-${sIdx}`, strat.quickReviewCommand!)}
                                      className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"
                                    >
                                      {copiedId === `cmd-${sIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                      <span>{copiedId === `cmd-${sIdx}` ? 'Copied' : 'Copy'}</span>
                                    </button>
                                  </div>
                                  <pre className="p-2 overflow-x-auto text-[10px] leading-relaxed text-emerald-300">
                                    <code>{strat.quickReviewCommand}</code>
                                  </pre>
                                </div>
                              )}

                              {/* Action Buttons inside Card */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {strat.moduleId && onOpenQuiz && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenQuiz(strat.moduleId!)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#0078D4] hover:bg-[#0068B8] flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Retake Quiz</span>
                                  </button>
                                )}

                                {onAddTask && (
                                  <button
                                    type="button"
                                    onClick={() => handleAddTaskFromStrategy(strat, sIdx)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 border border-purple-300/60 flex items-center gap-1 transition-colors"
                                  >
                                    {addedTaskId === `strat-${sIdx}` ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        <span>Added to Tasks!</span>
                                      </>
                                    ) : (
                                      <>
                                        <PlusCircle className="w-3 h-3" />
                                        <span>Add as Task</span>
                                      </>
                                    )}
                                  </button>
                                )}

                                {strat.moduleId && onOpenModule && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenModule(strat.moduleId!)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center gap-1"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    <span>Review Module</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Meta actions bar */}
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>

                      {msg.sender === 'copilot' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            title={speakingMessageId === msg.id ? 'Stop reading' : 'Read aloud'}
                            className="text-[10px] text-neutral-400 hover:text-[#0078D4] dark:hover:text-[#2899F5] flex items-center gap-1"
                          >
                            {speakingMessageId === msg.id ? (
                              <VolumeX className="w-3 h-3 text-rose-500" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy message"
                            className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Suggestions Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && msg.id === messages[messages.length - 1]?.id && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSendMessage(sug)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0078D4] dark:text-[#2899F5] border border-blue-200/80 dark:border-blue-800/80 flex items-center gap-1 transition-colors text-left"
                          >
                            <span>{sug}</span>
                            <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-neutral-500 text-xs py-2 px-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0078D4] to-[#8B5CF6] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1 p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-neutral-500 ml-1">Copilot is diagnosing your study strategy...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            
            {/* Input Form */}
            <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
              
              {/* Deep Reasoning & Attachments */}
              <div className="pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    title="Attach file (Artifacts)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsDeepReasoning(!isDeepReasoning)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                    isDeepReasoning 
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                      : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'
                  }`}
                  title="Toggle AI CLAUDE SONNET Max BRAIN Reasoning"
                >
                  <Brain className={`w-3 h-3 ${isDeepReasoning ? 'animate-pulse' : ''}`} />
                  <span>CLAUDE SONNET Max BRAIN {isDeepReasoning ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={currentCert ? `Ask about ${currentCert.code}...` : 'Ask Microsoft Copilot anything...'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] active:bg-[#005ba3] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
