import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Award, RefreshCw } from 'lucide-react';
import { Module, Certification, QuizQuestion, QuizAttemptRecord } from '../types';

interface QuizModalProps {
  module: Module | null;
  certification: Certification | null;
  onClose: () => void;
  onQuizPassed: (xpBonus: number) => void;
  onQuizCompleted?: (attempt: QuizAttemptRecord, xpBonus: number) => void;
  onOpenStudyStrategy?: (moduleId: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  module,
  certification,
  onClose,
  onQuizPassed,
  onQuizCompleted,
  onOpenStudyStrategy,
}) => {
  if (!module || !certification) return null;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentIndex(0);

    try {
      const response = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleTitle: module.title,
          certCode: certification.code,
          skillsCovered: module.skillsCovered,
        }),
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [module.id]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    const missedTopics: {
      question: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }[] = [];

    questions.forEach((q, idx) => {
      const userChoiceIndex = selectedAnswers[idx];
      const isCorrect = userChoiceIndex === q.correctIndex;
      if (isCorrect) {
        calculatedScore += 1;
      } else {
        missedTopics.push({
          question: q.question,
          userAnswer: userChoiceIndex !== undefined ? q.options[userChoiceIndex] : 'No answer selected',
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    const isPassed = calculatedScore >= 2;
    const xpBonus = isPassed ? 300 : 50;

    const attemptRecord: QuizAttemptRecord = {
      id: `quiz-attempt-${Date.now()}`,
      moduleId: module.id,
      moduleTitle: module.title,
      certId: certification.id,
      certCode: certification.code,
      score: calculatedScore,
      totalQuestions: questions.length,
      passed: isPassed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      skillsCovered: module.skillsCovered,
      missedTopics,
    };

    if (onQuizCompleted) {
      onQuizCompleted(attemptRecord, isPassed ? 300 : 0);
    } else if (isPassed) {
      onQuizPassed(300);
    }
  };

  const currentQ = questions[currentIndex];

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
          className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Microsoft Learn AI Knowledge Check
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-1">
                {module.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#0078D4] animate-spin" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Generating context-aware exam questions with Gemini AI...
              </p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              Unable to load questions. Please check your connection.
            </div>
          ) : isSubmitted ? (
            /* Results Screen */
            <div className="py-6 space-y-6">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white shadow-lg ${
                  score >= 2 ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-amber-500 shadow-amber-500/30'
                }`}>
                  {score >= 2 ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white mt-3">
                  {score >= 2 ? 'Congratulations! Quiz Passed' : 'Review & Practice Again'}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  You scored <strong className="text-neutral-900 dark:text-white">{score} / {questions.length}</strong> correct.
                  {score >= 2 && ' +300 Bonus Microsoft Learn XP added to your profile!'}
                </p>
              </div>

              {/* Review questions */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                      }`}
                    >
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                        <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                      </p>
                      <p className="mt-1 text-neutral-500 dark:text-neutral-400 italic">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Copilot Study Strategy Suggestion if struggled */}
              {score < questions.length && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0078D4] to-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        Struggling with this topic?
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Get personalized exam strategy & CLI drills from Copilot.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenStudyStrategy) {
                        onOpenStudyStrategy(module.id);
                      } else {
                        window.dispatchEvent(new CustomEvent('open-copilot-strategy', { detail: { moduleId: module.id } }));
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0078D4] hover:bg-[#0068B8] text-white text-xs font-bold shadow-xs whitespace-nowrap flex items-center gap-1 transition-transform active:scale-95"
                  >
                    <span>Analyze with Copilot</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={fetchQuestions}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0078D4] hover:bg-[#0068B8]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="py-5 space-y-5">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{Object.keys(selectedAnswers).length} / {questions.length} answered</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-purple-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>

              {/* Animated Question Block */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  {/* Question Text */}
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-snug">
                    {currentQ.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentIndex] === optIdx;
                      return (
                        <motion.button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.01 }}
                          className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-medium text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 dark:border-purple-500 text-purple-900 dark:text-purple-200 shadow-sm ring-1 ring-purple-500'
                              : 'bg-white dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-tight">{option}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 disabled:opacity-30"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={Object.keys(selectedAnswers).length < questions.length}
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 shadow-md shadow-emerald-600/20"
                  >
                    Submit Knowledge Check
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
