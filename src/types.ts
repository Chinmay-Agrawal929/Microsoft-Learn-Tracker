export type DomainId = 'cloud' | 'ai' | 'security' | 'data' | 'devops';

export interface MicroTask {
  id: string;
  title: string;
  type: 'reading' | 'lab' | 'knowledge_check' | 'custom';
  durationMinutes: number;
  completed: boolean;
  notes?: string;
  learnUrl?: string;
}

export interface Module {
  id: string;
  certId: string;
  title: string;
  description: string;
  learnUrl: string;
  estimatedMinutes: number;
  xp: number;
  prerequisites: string[]; // module IDs or cert IDs
  order: number;
  tasks: MicroTask[];
  skillsCovered: string[];
  architectureTip?: string;
  examTip?: string;
  scenarioStudy?: string;
  cheatSheet?: string[];
}

export interface Certification {
  id: string;
  domainId: DomainId;
  code: string; // e.g., 'AZ-900', 'AZ-104', 'AZ-305'
  title: string;
  level: 'Fundamentals' | 'Associate' | 'Expert' | 'Specialty';
  icon: string;
  description: string;
  learnUrl: string;
  examUrl?: string;
  totalXp: number;
  prerequisites: string[]; // cert IDs required before this
  color: string;
  modules: Module[];
}

export interface LearningTrack {
  id: DomainId;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  badgeIcon: string;
  certifications: Certification[];
}

export interface UserCustomTask {
  id: string;
  moduleId?: string;
  certId?: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  notes?: string;
}

export interface QuizAttemptRecord {
  id: string;
  moduleId: string;
  moduleTitle: string;
  certId: string;
  certCode: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timestamp: string;
  missedTopics: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
  skillsCovered: string[];
}

export interface ModuleStruggleSummary {
  moduleId: string;
  moduleTitle: string;
  certCode: string;
  attemptsCount: number;
  failedAttemptsCount: number;
  averageScore: number;
  lastScore: number;
  missedSkillTopics: string[];
  lastAttemptDate: string;
}

export interface StudyStrategyTip {
  struggleModuleTitle: string;
  moduleId?: string;
  certCode: string;
  rootCauseAnalysis: string;
  remediationSteps: string[];
  examTrapAlert: string;
  handsOnLabRecommendation: string;
  quickReviewCommand?: string;
  priority: 'critical' | 'moderate' | 'solid';
}

export interface UserProgressState {
  completedModuleIds: string[];
  completedCertIds: string[];
  completedTaskIds: string[]; // micro-task IDs
  customTasks: UserCustomTask[];
  moduleNotes: Record<string, string>; // moduleId -> note
  totalXp: number;
  totalTimeMinutes: number;
  studyStreakDays: number;
  lastActiveDate: string;
  achievements: string[];
  quizAttempts?: QuizAttemptRecord[];
  strugglingModuleIds?: string[];
  targetGoal?: {
    certId: string;
    targetDate: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  accountType: 'Work or School' | 'Personal Microsoft Account';
  organization?: string;
  avatarUrl: string;
  roleTitle: string;
  gender?: 'male' | 'female' | 'unspecified';
  isSignedIn: boolean;
  microsoftTenant: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  suggestions?: string[];
  groundingSources?: { title: string; url: string }[];
  strategyData?: StudyStrategyTip[];
  isStrategyReport?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SmartNotification {
  id: string;
  title: string;
  moduleTitle: string;
  certCode: string;
  motivationalNote: string;
  whyItMatters: string;
  recommendedTime: string;
  timestamp: string;
}
