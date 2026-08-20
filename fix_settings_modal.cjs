const fs = require('fs');
let settings = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

settings = settings.replace(
  /onSetTheme\?: \(t: 'light' \| 'dark' \| 'neon'\) => void;/,
  "onSetTheme?: (t: string) => void;"
);

// We need to rebuild the Theme section.
const themeSection = `
            {/* Theme & Display Settings */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Appearance & Theme Switch
              </label>
              <div className="grid grid-cols-4 gap-2">
                {/* Light */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'light') { onSetTheme ? onSetTheme('light') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'light'
                      ? 'border-[#0078D4] bg-blue-50/60 dark:bg-blue-950/40 text-[#0078D4] font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center shadow-sm">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Light</span>
                </button>

                {/* Dark */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'dark') { onSetTheme ? onSetTheme('dark') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'dark'
                      ? 'border-[#0078D4] bg-blue-50/60 dark:bg-blue-950/40 text-blue-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-sm">
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Dark</span>
                </button>

                {/* Neon */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'neon') { onSetTheme ? onSetTheme('neon') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'neon'
                      ? 'border-fuchsia-500 bg-fuchsia-950/40 text-fuchsia-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#0f0518] border border-fuchsia-500/50 flex items-center justify-center shadow-[0_0_8px_rgba(255,0,255,0.3)]">
                    <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Neon</span>
                </button>
                
                {/* Classic Blue */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-classic') { onSetTheme ? onSetTheme('chrome-classic') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'chrome-classic'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Classic</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2">
                {/* Midnight */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-midnight') { onSetTheme ? onSetTheme('chrome-midnight') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'chrome-midnight'
                      ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-indigo-500/50 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-indigo-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Midnight</span>
                </button>

                {/* Mint */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-mint') { onSetTheme ? onSetTheme('chrome-mint') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'chrome-mint'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Mint</span>
                </button>

                {/* Rose */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-rose') { onSetTheme ? onSetTheme('chrome-rose') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'chrome-rose'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Rose</span>
                </button>

                {/* Lavender */}
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'chrome-lavender') { onSetTheme ? onSetTheme('chrome-lavender') : onToggleTheme(); }
                  }}
                  className={\`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-colors \${
                    theme === 'chrome-lavender'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }\`}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wide">Lavender</span>
                </button>
              </div>
            </div>`;

settings = settings.replace(
  /\{\/\* Theme & Display Settings \*\/\}.*?(?=\{\/\* Target Certification Goal \*\/\})/s,
  themeSection + '\n\n            '
);

fs.writeFileSync('src/components/SettingsModal.tsx', settings);
