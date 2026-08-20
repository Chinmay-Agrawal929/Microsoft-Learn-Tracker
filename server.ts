import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { LEARNING_TRACKS, INITIAL_USER_PROGRESS, INITIAL_USER_PROFILE } from './src/data/learningTracks';
import { UserProgressState, UserProfile } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent state
let currentUserProgress: UserProgressState = { ...INITIAL_USER_PROGRESS };
let currentUserProfile: UserProfile = { ...INITIAL_USER_PROFILE };

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Prerequisite logic verification
function evaluatePrerequisites(completedModuleIds: string[], completedCertIds: string[]) {
  const moduleStates: Record<string, 'completed' | 'available' | 'locked'> = {};
  const certStates: Record<string, 'completed' | 'available' | 'locked'> = {};

  LEARNING_TRACKS.forEach(track => {
    track.certifications.forEach(cert => {
      // Evaluate certification state
      const isCertCompleted = completedCertIds.includes(cert.id) ||
        cert.modules.every(m => completedModuleIds.includes(m.id));

      if (isCertCompleted) {
        certStates[cert.id] = 'completed';
      } else {
        const certPrereqsMet = cert.prerequisites.length === 0 ||
          cert.prerequisites.every(reqId => certStates[reqId] === 'completed' || completedCertIds.includes(reqId));
        certStates[cert.id] = certPrereqsMet ? 'available' : 'locked';
      }

      // Evaluate each module state
      cert.modules.forEach(mod => {
        if (completedModuleIds.includes(mod.id)) {
          moduleStates[mod.id] = 'completed';
        } else {
          // Module prerequisites
          const modPrereqsMet = mod.prerequisites.length === 0 ||
            mod.prerequisites.every(pId => completedModuleIds.includes(pId));
          const certParentAvailable = certStates[cert.id] !== 'locked';

          if (modPrereqsMet && certParentAvailable) {
            moduleStates[mod.id] = 'available';
          } else {
            moduleStates[mod.id] = 'locked';
          }
        }
      });
    });
  });

  return { moduleStates, certStates };
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Learning Tracks & Prerequisite evaluation
app.get('/api/tracks', (req, res) => {
  const { moduleStates, certStates } = evaluatePrerequisites(
    currentUserProgress.completedModuleIds,
    currentUserProgress.completedCertIds
  );

  res.json({
    tracks: LEARNING_TRACKS,
    moduleStates,
    certStates,
  });
});

// 3. User Progress Endpoints
app.get('/api/user/progress', (req, res) => {
  const { moduleStates, certStates } = evaluatePrerequisites(
    currentUserProgress.completedModuleIds,
    currentUserProgress.completedCertIds
  );

  res.json({
    progress: currentUserProgress,
    profile: currentUserProfile,
    moduleStates,
    certStates,
  });
});

app.post('/api/user/progress', (req, res) => {
  const {
    completedModuleIds,
    completedCertIds,
    completedTaskIds,
    moduleNotes,
    totalXp,
    totalTimeMinutes,
    studyStreakDays,
    achievements,
    targetGoal
  } = req.body;

  if (completedModuleIds !== undefined) currentUserProgress.completedModuleIds = completedModuleIds;
  if (completedCertIds !== undefined) currentUserProgress.completedCertIds = completedCertIds;
  if (completedTaskIds !== undefined) currentUserProgress.completedTaskIds = completedTaskIds;
  if (moduleNotes !== undefined) currentUserProgress.moduleNotes = { ...currentUserProgress.moduleNotes, ...moduleNotes };
  if (totalXp !== undefined) currentUserProgress.totalXp = totalXp;
  if (totalTimeMinutes !== undefined) currentUserProgress.totalTimeMinutes = totalTimeMinutes;
  if (studyStreakDays !== undefined) currentUserProgress.studyStreakDays = studyStreakDays;
  if (achievements !== undefined) currentUserProgress.achievements = achievements;
  if (targetGoal !== undefined) currentUserProgress.targetGoal = targetGoal;
  if (req.body.quizAttempts !== undefined) currentUserProgress.quizAttempts = req.body.quizAttempts;
  if (req.body.strugglingModuleIds !== undefined) currentUserProgress.strugglingModuleIds = req.body.strugglingModuleIds;
  currentUserProgress.lastActiveDate = new Date().toISOString().split('T')[0];

  const { moduleStates, certStates } = evaluatePrerequisites(
    currentUserProgress.completedModuleIds,
    currentUserProgress.completedCertIds
  );

  res.json({
    success: true,
    progress: currentUserProgress,
    moduleStates,
    certStates,
  });
});

// 4. Custom Tasks CRUD
app.post('/api/user/custom-task', (req, res) => {
  const { title, moduleId, certId, priority, dueDate, notes } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: `custom-task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    moduleId,
    certId,
    completed: false,
    priority: priority || 'medium',
    dueDate: dueDate || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  currentUserProgress.customTasks = [newTask, ...currentUserProgress.customTasks];
  res.json({ success: true, task: newTask, customTasks: currentUserProgress.customTasks });
});

app.put('/api/user/custom-task/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, priority, dueDate, notes } = req.body;

  let found = false;
  currentUserProgress.customTasks = currentUserProgress.customTasks.map(task => {
    if (task.id === id) {
      found = true;
      return {
        ...task,
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(notes !== undefined && { notes }),
      };
    }
    return task;
  });

  if (!found) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ success: true, customTasks: currentUserProgress.customTasks });
});

app.delete('/api/user/custom-task/:id', (req, res) => {
  const { id } = req.params;
  currentUserProgress.customTasks = currentUserProgress.customTasks.filter(t => t.id !== id);
  res.json({ success: true, customTasks: currentUserProgress.customTasks });
});

// 5. Microsoft Entra ID & Account Validation & SSO
app.post('/api/auth/validate-email', (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    return res.status(422).json({
      valid: false,
      error: 'Please enter a valid email address in the format user@domain.com',
    });
  }

  const domain = cleanEmail.split('@')[1];
  let accountType: 'Work or School' | 'Personal Microsoft Account' = 'Work or School';
  let organization = 'Enterprise Cloud Organization';
  let tenantId = 'tenant-' + Math.random().toString(36).substring(2, 9);
  let authMethods = ['password', 'authenticator_2fa', 'security_key'];
  let isFederated = false;

  if (
    domain === 'microsoft.com' ||
    domain === 'partner.microsoft.com' ||
    domain.endsWith('.onmicrosoft.com') ||
    domain.includes('azure')
  ) {
    accountType = 'Work or School';
    organization = domain.includes('microsoft.com') ? 'Microsoft Corporation' : `${domain.split('.')[0].toUpperCase()} Enterprise Tenant`;
    tenantId = '72f988bf-86f1-41af-91ab-2d7cd011db47';
    isFederated = true;
  } else if (
    domain === 'outlook.com' ||
    domain === 'hotmail.com' ||
    domain === 'live.com' ||
    domain === 'msn.com'
  ) {
    accountType = 'Personal Microsoft Account';
    organization = 'Microsoft Personal Services';
    tenantId = 'msa-directory-91823';
    isFederated = false;
  } else if (domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'icloud.com') {
    accountType = 'Personal Microsoft Account';
    organization = 'Personal Microsoft Account (Linked)';
    tenantId = 'msa-federated-link';
    isFederated = false;
  } else {
    // Custom corporate domain
    accountType = 'Work or School';
    const orgName = domain.split('.')[0];
    organization = `${orgName.charAt(0).toUpperCase() + orgName.slice(1)} Cloud Tenant`;
    tenantId = `entra-${orgName}-directory`;
    isFederated = true;
  }

  return res.json({
    valid: true,
    email: cleanEmail,
    domain,
    accountType,
    organization,
    tenantId,
    authMethods,
    isFederated,
    detectedName: cleanEmail.split('@')[0].replace(/[\._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, accountType, organization, roleTitle, avatarUrl } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required to create your account.' });
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  currentUserProfile = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    accountType: accountType || 'Personal Microsoft Account',
    organization: organization ? organization.trim() : (email.includes('microsoft.com') ? 'Microsoft Corporation' : ''),
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleTitle: roleTitle ? roleTitle.trim() : 'Cloud & AI Engineer',
    isSignedIn: true,
    microsoftTenant: `Microsoft Identity Platform (${organization ? organization.trim() : 'Personal Account'})`,
  };

  res.json({
    success: true,
    message: 'Microsoft Account created successfully!',
    profile: currentUserProfile,
  });
});

app.post('/api/auth/profile', (req, res) => {
  const updates = req.body;
  currentUserProfile = {
    ...currentUserProfile,
    ...updates,
  };
  res.json({
    success: true,
    profile: currentUserProfile,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, authMethod, accountType, name, organization, roleTitle, avatarUrl } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Verification simulation
  const validEmail = email.includes('@') && email.length >= 5;
  if (!validEmail) {
    return res.status(401).json({ error: 'Invalid Microsoft credentials provided' });
  }

  currentUserProfile = {
    name: name || currentUserProfile.name || (email.split('@')[0].replace(/[\._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())),
    email: email.trim().toLowerCase(),
    accountType: accountType || 'Personal Microsoft Account',
    organization: organization || currentUserProfile.organization || '',
    avatarUrl: avatarUrl || currentUserProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleTitle: roleTitle || currentUserProfile.roleTitle || 'Certified Cloud & AI Engineer',
    isSignedIn: true,
    microsoftTenant: `Microsoft Identity Platform (${organization || 'Active Tenant'})`,
  };

  res.json({
    success: true,
    message: 'Authenticated via Microsoft Identity Platform',
    profile: currentUserProfile,
  });
});

app.post('/api/auth/logout', (req, res) => {
  currentUserProfile = {
    ...currentUserProfile,
    isSignedIn: false,
  };
  res.json({ success: true, profile: currentUserProfile });
});

// 6. AI Smart Notification Generator (Milestone relevance & unlock rationale)
app.post('/api/ai/motivate', async (req, res) => {
  const { unlockedModuleTitle, completedModuleTitle, certCode, trackName, userGoal } = req.body;

  const fallbackResponse = {
    title: `🎉 Milestone Unlocked: ${unlockedModuleTitle}`,
    motivationalNote: `Outstanding progress! By finishing ${completedModuleTitle || 'your prior module'}, you've laid the critical groundwork. ${unlockedModuleTitle} in ${certCode} unlocks key enterprise architecture skills needed for senior cloud and AI engineering roles.`,
    whyItMatters: `Directly builds on your previous study. Mastering this module elevates your certification readiness for ${certCode} and accelerates your Microsoft Learn XP ranking.`,
    recommendedTime: '45-60 minutes focused study'
  };

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json(fallbackResponse);
    }

    const prompt = `You are Microsoft Learn Copilot, an expert AI mentor for Microsoft cloud, AI, and security certifications.
The student has just completed: "${completedModuleTitle || 'Fundamentals'}"
And just unlocked: "${unlockedModuleTitle}" in certification "${certCode}" (Domain: ${trackName || 'Cloud'}).
Student's target goal: "${userGoal || 'Clear Microsoft Certifications and excel in technical interview'}".

Generate an inspiring, technically accurate motivational note explaining:
1. Why completing the previous module unlocks this new step.
2. Why this specific new topic (${unlockedModuleTitle}) is essential in real enterprise architectures and technical interviews.
3. A brief study tip.

Respond in strict JSON with keys: "title", "motivationalNote", "whyItMatters", "recommendedTime". Keep text concise, professional, encouraging, and high-impact.`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            motivationalNote: { type: Type.STRING },
            whyItMatters: { type: Type.STRING },
            recommendedTime: { type: Type.STRING }
          },
          required: ['title', 'motivationalNote', 'whyItMatters', 'recommendedTime']
        }
      }
    });

    const parsed = JSON.parse(aiResponse.text || '{}');
    res.json({
      title: parsed.title || fallbackResponse.title,
      motivationalNote: parsed.motivationalNote || fallbackResponse.motivationalNote,
      whyItMatters: parsed.whyItMatters || fallbackResponse.whyItMatters,
      recommendedTime: parsed.recommendedTime || fallbackResponse.recommendedTime
    });
  } catch (err) {
    console.error('AI Motivate error, falling back:', err);
    res.json(fallbackResponse);
  }
});

// 7. AI Knowledge Check Quiz Generator
app.post('/api/ai/quiz', async (req, res) => {
  const { moduleTitle, certCode, skillsCovered } = req.body;

  const fallbackQuestions = [
    {
      question: `What is a primary architectural advantage of using ${moduleTitle || 'cloud services'} in Microsoft Azure?`,
      options: [
        'High availability, elasticity, and global scale with reduced operational overhead',
        'Guaranteed zero cost regardless of consumption tiers',
        'Elimination of all networking firewall requirements',
        'Forcing all workloads to run single-threaded'
      ],
      correctIndex: 0,
      explanation: 'Azure cloud architecture provides automated elasticity, multi-region redundancy, and shared responsibility security.'
    },
    {
      question: `In Microsoft Learn certification guidelines for ${certCode || 'Azure'}, what tenet represents Zero Trust?`,
      options: [
        'Implicit trust inside corporate perimeter',
        'Verify explicitly, use least privilege access, and assume breach',
        'Disable Multi-Factor Authentication for admins',
        'Store secrets in plain text configuration files'
      ],
      correctIndex: 1,
      explanation: 'The three core tenets of Microsoft Zero Trust are: Verify explicitly, Use least privileged access, and Assume breach.'
    },
    {
      question: `Which Microsoft service is recommended for managing secrets, certificates, and cryptographic keys?`,
      options: [
        'Azure Key Vault',
        'Azure Disk Snapshot',
        'Azure ExpressRoute',
        'Azure Blob Cold Archive'
      ],
      correctIndex: 0,
      explanation: 'Azure Key Vault securely stores cryptographic keys, secrets, and certificates with hardware security module (HSM) backing.'
    }
  ];

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ questions: fallbackQuestions });
    }

    const prompt = `Generate 3 realistic, high-quality Microsoft Learn certification exam practice questions for module "${moduleTitle}" in "${certCode}".
Skills covered: ${(skillsCovered || []).join(', ')}.

Respond in strict JSON with an array of objects matching the schema.`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctIndex', 'explanation']
          }
        }
      }
    });

    const questions = JSON.parse(aiResponse.text || '[]');
    res.json({ questions: questions.length ? questions : fallbackQuestions });
  } catch (err) {
    console.error('Quiz AI error, falling back:', err);
    res.json({ questions: fallbackQuestions });
  }
});

// 8. Microsoft Copilot Chat Assistant
app.post('/api/copilot/chat', async (req, res) => {
  const { message, history, currentModule, currentCert, quizAttempts, strugglingModuleIds, isDeepReasoning } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const userAttempts = quizAttempts || currentUserProgress.quizAttempts || [];
  const userStruggles = strugglingModuleIds || currentUserProgress.strugglingModuleIds || [];

  const fallbackText = `**Action Required: API Key Missing**

I am your **Microsoft Learn Copilot**. 
Please configure your \`GEMINI_API_KEY\` (and \`ANTHROPIC_API_KEY\` if using Deep Reasoning) in the **Settings** menu (gear icon) to connect to my brain so I can answer your queries.

Here are quick insights on your study path:
- **Active Path**: ${currentCert ? currentCert.code + ' - ' + currentCert.title : 'Azure Solutions & AI Track'}
- **Focus Tip**: Combine conceptual reading on Microsoft Learn with hands-on practice sandbox labs.
- **Exam Guidance**: For questions regarding architecture design, remember Microsoft's Well-Architected Framework: Reliability, Security, Cost Optimization, Operational Excellence, and Performance Efficiency.

How else can I assist you with your certification prep today?`;

  try {
    let struggleContext = '';
    if (userAttempts.length > 0) {
      const failedAttempts = userAttempts.filter((a: any) => !a.passed || (a.score / a.totalQuestions) < 0.7);
      if (failedAttempts.length > 0) {
        struggleContext = `User Quiz Performance Data & Identified Struggles:\n` +
          failedAttempts.slice(-3).map((a: any) => 
            `- Module "${a.moduleTitle}" (${a.certCode}): Scored ${a.score}/${a.totalQuestions}. Missed topics: ${a.missedTopics?.map((m: any) => `"${m.question}" (Selected: ${m.userAnswer})`).join('; ')}`
          ).join('\n');
      }
    }

    const systemInstruction = `You are Microsoft Copilot for Microsoft Learn—an elite, friendly, deeply encouraging, and knowledgeable AI technical tutor and certification coach.
Your mission is to not only explain complex technical cloud/AI concepts with crystal clarity, but to actively appreciate, cheer, motivate, and empower the learner. Celebrate their study streak, encourage them through tricky certification concepts, and remind them that consistent effort transforms them into a certified cloud & AI architect!
You help learners master Microsoft Azure, Azure AI, Microsoft Entra ID, Microsoft Defender, Microsoft Sentinel, Power Platform, Microsoft Fabric, and Data Engineering.
You provide crisp, clear, well-formatted markdown answers with bold keywords, bullet points, and code/CLI snippets when relevant.
When the user asks for encouragement, motivation, or cheer, give them a high-energy, uplifting message highlighting the exciting real-world career impact of their certifications!
Current context: User is studying certification ${currentCert?.code || 'Azure'} and module ${currentModule?.title || 'General'}.
User Profile: ${currentUserProfile.name}, Level: ${currentUserProgress.totalXp} XP, Streak: ${currentUserProgress.studyStreakDays} days.
${struggleContext ? `\nContext on learner's recent quiz struggles:\n${struggleContext}\nTailor your explanations and study tips to help them conquer these specific weak areas without making them feel discouraged.` : ''}
Keep responses engaging, accurate according to official Microsoft Learn documentation, and provide 3 relevant follow-up prompt suggestions.`;

    let replyText = '';

    if (isDeepReasoning) {
      if (!process.env.ANTHROPIC_API_KEY) {
         return res.json({
           reply: "**Action Required: Anthropic API Key Missing**\n\nDeep Reasoning mode is enabled, which uses Claude 3.5 Sonnet. Please add your \`ANTHROPIC_API_KEY\` in the settings menu.",
           suggestions: ['Analyze my quiz failure patterns', 'Give me a personalized study strategy']
         });
      }
      
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const claudeSystem = systemInstruction + "\n\nDEEP REASONING MODE ACTIVE. You MUST use <thinking>...</thinking> tags at the very beginning of your response to outline your step-by-step logic, architectural trade-offs, and deep analysis before you provide your final output. Be thorough and analytical in the thinking block.";
      
      const anthropicMessages = (history || []).slice(-6).map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text
      }));
      anthropicMessages.push({ role: 'user', content: message });

      const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        temperature: 0.7,
        system: claudeSystem,
        messages: anthropicMessages,
      });

      const textContent = msg.content.find(c => c.type === 'text');
      replyText = (textContent && 'text' in textContent) ? textContent.text : fallbackText;

    } else {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: fallbackText,
          suggestions: [
            'Explain Azure RBAC vs Entra Roles',
            'Give me a 5-minute quiz on AZ-104',
            'What is the difference between RPO and RTO?'
          ]
        });
      }

      const chatHistory = (history || []).slice(-6).map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      replyText = response.text || fallbackText;
    }

    res.json({
      reply: replyText,
      suggestions: [
        'Analyze my quiz failure patterns',
        'Give me a personalized study strategy',
        'Quiz me on my weak areas'
      ]
    });
  } catch (err) {
    console.error('Copilot Chat AI error, falling back:', err);
    res.json({
      reply: fallbackText,
      suggestions: [
        'Explain Azure Blob Storage Tiers',
        'Compare Azure SQL vs Cosmos DB',
        'How to prepare for AZ-305 exam'
      ]
    });
  }
});

// 9. Personalized Study Strategy Generator based on Quiz Failure Patterns
app.post('/api/copilot/study-strategy', async (req, res) => {
  const { quizAttempts, strugglingModuleIds, currentCert, currentModule, isDeepReasoning } = req.body;

  const attempts = (quizAttempts && quizAttempts.length > 0)
    ? quizAttempts
    : (currentUserProgress.quizAttempts || []);

  const failedAttempts = attempts.filter((a: any) => !a.passed || (a.score / a.totalQuestions) < 0.7);

  // Default fallback strategy tips if AI fails or no key
  const defaultTips = failedAttempts.length > 0 ? failedAttempts.map((fa: any) => {
    const missedQuestionsSummary = fa.missedTopics?.map((m: any) => m.question).join('; ') || 'Core architectural concepts';
    return {
      struggleModuleTitle: fa.moduleTitle,
      moduleId: fa.moduleId,
      certCode: fa.certCode || (currentCert ? currentCert.code : 'AZ-900'),
      priority: 'critical' as const,
      rootCauseAnalysis: `Recent quiz results indicate confusion on ${fa.skillsCovered?.slice(0, 2).join(' & ') || 'core principles'}, particularly around: ${missedQuestionsSummary.slice(0, 140)}...`,
      remediationSteps: [
        `1. **Active Recall**: Re-read the official Microsoft Learn units focusing specifically on SLA differences, deployment boundaries, and high-availability guarantees.`,
        `2. **Hands-on Sandbox Isolation**: Execute the CLI commands directly in the Azure sandbox to observe runtime behavior rather than just memorizing definitions.`,
        `3. **Comparison Matrix**: Create a quick 2-column comparison table in your study notes contrast-checking tradeoffs.`
      ],
      examTrapAlert: `⚠️ **Exam Pitfall**: Microsoft Certification questions frequently present scenarios with budget constraints vs high-availability requirements. Remember that multi-zone deployments provide 99.99% VM uptime without requiring cross-region data transfer fees.`,
      handsOnLabRecommendation: `Launch the Azure Sandbox for ${fa.moduleTitle} and verify resource deployment with 'az resource list --output table'.`,
      quickReviewCommand: `az group create --name SandboxRG --location eastus\naz vm create --resource-group SandboxRG --name DemoVM --image Ubuntu2204 --zone 1`,
    };
  }) : [
    {
      struggleModuleTitle: currentModule ? currentModule.title : 'Azure Architecture, Regions & Compute Services',
      moduleId: currentModule ? currentModule.id : 'az-900-mod-2',
      certCode: currentCert ? currentCert.code : 'AZ-900',
      priority: 'moderate' as const,
      rootCauseAnalysis: 'Identified periodic mistakes distinguishing between Availability Zones (<2ms latency fiber in same region) vs Region Pairs (>=300 miles apart for disaster recovery).',
      remediationSteps: [
        '1. **Review Azure SLA Documentation**: Study the 99.99% single-region multi-zone SLA vs paired-region failover.',
        '2. **Hands-on Azure CLI Lab**: Deploy paired resources to East US and West US to verify geo-redundant storage replication.',
        '3. **Targeted Micro-Quiz**: Retake the 3-question knowledge check to reinforce retention.'
      ],
      examTrapAlert: '⚠️ **Exam Pitfall**: AZ-900 and AZ-104 exams will ask which service guarantees datacenter fault isolation inside ONE geography. The correct answer is Availability Zones, NOT Region Pairs.',
      handsOnLabRecommendation: 'Practice deploying a Zone-redundant Azure SQL Database and verifying automated failover triggers.',
      quickReviewCommand: 'az account list-locations --query "[?metadata.pairedRegion!=null].[name, metadata.pairedRegion[0].name]" -o table'
    }
  ];

  try {
    if (!process.env.GEMINI_API_KEY || attempts.length === 0) {
      return res.json({
        strategies: defaultTips,
        summaryMarkdown: generateStrategySummaryMarkdown(defaultTips, currentUserProfile.name)
      });
    }

    const failureSummaryText = attempts.map((a: any) => `
- Module: "${a.moduleTitle}" (Cert: ${a.certCode})
  Score: ${a.score} out of ${a.totalQuestions} (Passed: ${a.passed ? 'Yes' : 'No'})
  Skills Covered: ${(a.skillsCovered || []).join(', ')}
  Missed Questions & Answers:
  ${(a.missedTopics || []).map((m: any, idx: number) => `  ${idx + 1}. Question: "${m.question}"
     User chose: "${m.userAnswer}"
     Correct answer: "${m.correctAnswer}"
     Explanation: "${m.explanation}"`).join('\n')}
`).join('\n---\n');

    const prompt = `You are Microsoft Copilot's Senior Learning Architect and Certification Coach.
A student named "${currentUserProfile.name}" is preparing for Microsoft Certifications (Target: ${currentCert ? currentCert.code + ' ' + currentCert.title : 'Microsoft Azure'}).

Analyze their recent Quiz Attempt & Failure Patterns below:
${failureSummaryText}

Formulate a deeply personalized, actionable, technical 'Study Strategy' tailored strictly to the root causes of their mistakes.
Pinpoint why they got those specific questions wrong (e.g. confusing Availability Zones with Region Pairs, misidentifying serverless compute, misinterpreting IAM/RBAC scope boundaries).

Respond with a JSON array of structured strategy objects matching this schema:
[
  {
    "struggleModuleTitle": string,
    "moduleId": string,
    "certCode": string,
    "priority": "critical" | "moderate" | "solid",
    "rootCauseAnalysis": string (detailed technical explanation of why they failed and what misconception they have),
    "remediationSteps": string[] (array of 3 distinct, high-impact study steps with bold headers),
    "examTrapAlert": string (exact exam trap trick Microsoft writers use for this topic),
    "handsOnLabRecommendation": string (a specific micro-lab to build in Azure sandbox),
    "quickReviewCommand": string (optional Azure CLI or PowerShell one-liner or snippet to verify concept)
  }
]`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              struggleModuleTitle: { type: Type.STRING },
              moduleId: { type: Type.STRING },
              certCode: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ['critical', 'moderate', 'solid'] },
              rootCauseAnalysis: { type: Type.STRING },
              remediationSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              examTrapAlert: { type: Type.STRING },
              handsOnLabRecommendation: { type: Type.STRING },
              quickReviewCommand: { type: Type.STRING }
            },
            required: ['struggleModuleTitle', 'certCode', 'priority', 'rootCauseAnalysis', 'remediationSteps', 'examTrapAlert', 'handsOnLabRecommendation']
          }
        }
      }
    });

    const parsedStrategies = JSON.parse(aiResponse.text || '[]');
    const finalStrategies = parsedStrategies.length > 0 ? parsedStrategies : defaultTips;

    return res.json({
      strategies: finalStrategies,
      summaryMarkdown: generateStrategySummaryMarkdown(finalStrategies, currentUserProfile.name)
    });
  } catch (err) {
    console.error('Study strategy error:', err);
    res.json({
      strategies: defaultTips,
      summaryMarkdown: generateStrategySummaryMarkdown(defaultTips, currentUserProfile.name)
    });
  }
});

function generateStrategySummaryMarkdown(tips: any[], userName: string): string {
  if (!tips || tips.length === 0) {
    return `### 🎯 Diagnostic Report: All Clear!\n\nNo active quiz failure patterns detected. You are demonstrating solid mastery across all tested Microsoft Learn modules. Keep building consistency!`;
  }

  const primary = tips[0];
  return `### 🎯 Personalized Study Strategy for **${userName}**\n\n` +
    `Based on your recent Microsoft Learn quiz diagnostic results, I've detected a key pattern in **${primary.struggleModuleTitle}** (${primary.certCode}):\n\n` +
    `**🔍 Root Cause Diagnosis:**\n${primary.rootCauseAnalysis}\n\n` +
    `**📋 Actionable 3-Step Remediation:**\n` +
    primary.remediationSteps.join('\n') + `\n\n` +
    `**⚠️ Exam Trap to Watch For:**\n${primary.examTrapAlert}\n\n` +
    `**🛠️ Recommended Hands-on Drill:**\n${primary.handsOnLabRecommendation}` +
    (primary.quickReviewCommand ? `\n\n\`\`\`sh\n${primary.quickReviewCommand}\n\`\`\`` : '');
}

// Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Microsoft Learn Path Tracker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
