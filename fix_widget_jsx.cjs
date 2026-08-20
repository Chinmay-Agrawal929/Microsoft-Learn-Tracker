const fs = require('fs');
let code = fs.readFileSync('src/components/CopilotWidget.tsx', 'utf8');

// I will just replace the bottom part completely.
const bottomPartRegex = /\{\/\* Input Form \*\/\}.*?(?=\n\s*<\/motion.div>)/s;
const fixedBottomPart = `
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
                  placeholder={currentCert ? \`Ask about \${currentCert.code}...\` : 'Ask Microsoft Copilot anything...'}
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
            </div>`;

code = code.replace(bottomPartRegex, fixedBottomPart);

fs.writeFileSync('src/components/CopilotWidget.tsx', code);
