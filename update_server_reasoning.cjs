const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// Chat endpoint fix
server = server.replace(
  /const \{ message, history, currentModule, currentCert, quizAttempts, strugglingModuleIds \} = req\.body;/,
  "const { message, history, currentModule, currentCert, quizAttempts, strugglingModuleIds, isDeepReasoning } = req.body;"
);

// We need to inject the deep reasoning text into systemInstruction for Chat
server = server.replace(
  /Keep responses engaging, accurate according to official Microsoft Learn documentation, and provide 3 relevant follow-up prompt suggestions\.`;/,
  `Keep responses engaging, accurate according to official Microsoft Learn documentation, and provide 3 relevant follow-up prompt suggestions.\n\${isDeepReasoning ? '\\n\\nDEEP REASONING MODE ACTIVE. You MUST use <thinking>...</thinking> tags at the very beginning of your response to outline your step-by-step logic, architectural trade-offs, and deep analysis before you provide your final output. Be thorough and analytical in the thinking block.' : ''}\`;`
);

// Strategy endpoint fix
server = server.replace(
  /const \{ quizAttempts, strugglingModuleIds, currentCert, currentModule \} = req\.body;/,
  "const { quizAttempts, strugglingModuleIds, currentCert, currentModule, isDeepReasoning } = req.body;"
);

// We need to inject the deep reasoning text into systemInstruction for Strategy
server = server.replace(
  /Provide actionable, high-impact remediation strategies\.\`;/,
  `Provide actionable, high-impact remediation strategies.\n\${isDeepReasoning ? '\\n\\nDEEP REASONING MODE ACTIVE. You MUST use <thinking>...</thinking> tags at the very beginning of your response to outline your step-by-step logic, architectural trade-offs, and deep analysis before you provide your final output. Be thorough and analytical in the thinking block.' : ''}\`;`
);

fs.writeFileSync('server.ts', server);
