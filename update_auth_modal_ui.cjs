const fs = require('fs');

let auth = fs.readFileSync('src/components/MicrosoftAuthModal.tsx', 'utf8');

const regGenderInput = `                  {/* Gender (For AI Avatar) */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Gender (Customizes your AI Copilot) <span className="text-[10px] text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0078D4] appearance-none"
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>`;

auth = auth.replace(
  /<div>\s*<label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">\s*Organization \/ Company.*?<\/div>/s,
  `<div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Organization / Company <span className="text-[10px] text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={regOrganization}
                      onChange={(e) => setRegOrganization(e.target.value)}
                      placeholder="e.g. Contoso Cloud or University"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
                    />
                  </div>
${regGenderInput}`
);


const editGenderInput = `                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Gender (Customizes your AI Copilot)
                    </label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4]"
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>`;

auth = auth.replace(
  /<div>\s*<label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">\s*Organization \/ Tenant.*?<\/div>/s,
  `<div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Organization / Tenant
                    </label>
                    <input
                      type="text"
                      value={editOrganization}
                      onChange={(e) => setEditOrganization(e.target.value)}
                      placeholder="e.g. Contoso Cloud or Personal"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4]"
                    />
                  </div>
${editGenderInput}`
);

fs.writeFileSync('src/components/MicrosoftAuthModal.tsx', auth);
