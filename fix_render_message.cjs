const fs = require('fs');
let code = fs.readFileSync('src/components/CopilotWidget.tsx', 'utf8');

// I need to add state for deep reasoning
code = code.replace(
  /const \[isLoading, setIsLoading\] = useState\(false\);/,
  "const [isLoading, setIsLoading] = useState(false);\n  const [isDeepReasoning, setIsDeepReasoning] = useState(false);"
);

// I need to parse <thinking>...</thinking> in renderMessageContent.
const newRenderMessage = `
  // Markdown & Code & Thinking block renderer helper
  const renderMessageContent = (text: string) => {
    // First, extract thinking blocks
    const hasThinking = text.includes('<thinking>') && text.includes('</thinking>');
    let mainText = text;
    let thinkingText = '';
    
    if (hasThinking) {
      const start = text.indexOf('<thinking>');
      const end = text.indexOf('</thinking>') + 11;
      thinkingText = text.substring(start + 10, end - 11).trim();
      mainText = text.substring(0, start) + text.substring(end);
    }
    
    const parts = mainText.split(/(^\\s*\`\`\`[\\s\\S]*?\\n\\s*\`\`\`\\s*$)/gm);

    return (
      <div className="space-y-2">
        {hasThinking && (
          <details className="mb-3 rounded-lg border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 overflow-hidden text-xs">
            <summary className="cursor-pointer px-3 py-2 flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold select-none outline-none">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>Deep Reasoning Output</span>
            </summary>
            <div className="px-3 pb-3 pt-1 text-neutral-600 dark:text-neutral-400 font-mono text-[10px] whitespace-pre-wrap leading-relaxed border-t border-purple-500/10">
              {thinkingText}
            </div>
          </details>
        )}
        {parts.map((part, i) => {
          const trimmedPart = part.trim();
          if (trimmedPart.startsWith('\`\`\`') && trimmedPart.endsWith('\`\`\`')) {
            const lines = trimmedPart.slice(3, -3).trim().split('\\n');
            const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : 'sh';
            const codeContent = (lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines.slice(1) : lines).join('\\n');

            return (
              <div key={i} className="my-2.5 rounded-xl overflow-hidden border border-neutral-700/80 bg-neutral-950 text-neutral-100 font-mono text-xs">
                <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{language}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(\`code-\${i}\`, codeContent)}
                    className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"
                  >
                    {copiedId === \`code-\${i}\` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="p-3 overflow-x-auto text-[11px] leading-relaxed">
                  <pre><code>{codeContent}</code></pre>
                </div>
              </div>
            );
          }
          
          return (
            <div key={i} className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mt-1 [&>ul]:mb-2 [&>li]:my-0.5">
              <Markdown>{part}</Markdown>
            </div>
          );
        })}
      </div>
    );
  };
`;

code = code.replace(
  /\/\/ Markdown & Code block renderer helper[\s\S]*?(?=\/\/ Toggle expansion)/,
  newRenderMessage + "\n\n  // Toggle expansion"
);

// Add deep reasoning toggle to the chat input UI
const deepReasoningToggle = `
          {/* Deep Reasoning & Attachments */}
          <div className="px-3 pb-2 flex items-center justify-between">
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
              className={\`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors \${
                isDeepReasoning 
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'
              }\`}
              title="Toggle Claude-style Deep Reasoning (Max Model Mode)"
            >
              <Brain className={\`w-3 h-3 \${isDeepReasoning ? 'animate-pulse' : ''}\`} />
              <span>Deep Reasoning {isDeepReasoning ? 'ON' : 'OFF'}</span>
            </button>
          </div>
          {/* Main Input Area */}
`;

code = code.replace(
  /\{\/\* Chat Input \*\/\}\n\s*<form onSubmit=\{handleSubmit\}/,
  `{/* Chat Input */}
        <form onSubmit={handleSubmit}`
);

code = code.replace(
  /<div className="flex items-center p-2 bg-neutral-50 dark:bg-neutral-900\/50 rounded-b-2xl border-t border-neutral-200\/80 dark:border-neutral-800\/80">/,
  `<div className="flex flex-col bg-neutral-50 dark:bg-neutral-900/50 rounded-b-2xl border-t border-neutral-200/80 dark:border-neutral-800/80 pt-2">\n${deepReasoningToggle}\n          <div className="flex items-end px-3 pb-3 gap-2">`
);

code = code.replace(
  /<input\n\s*type="text"/,
  `<input
                  type="text"`
);

// We need to change the surrounding div to close the extra flex container.
code = code.replace(
  /<\/form>/,
  `</div>\n        </form>`
);

fs.writeFileSync('src/components/CopilotWidget.tsx', code);
