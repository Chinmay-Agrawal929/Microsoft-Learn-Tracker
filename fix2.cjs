const fs = require('fs');
let code = fs.readFileSync('src/components/MobileNavBar.tsx', 'utf8');

// Fix 1: viewMode ternary end
code = code.replace(
  /<List className="w-3.5 h-3.5" \/>\n                \)/,
  '<List className="w-3.5 h-3.5" />\n                )}'
);

// Fix 2: streakDays stats
code = code.replace(
  /\{streakDays\}d\n                    <\/span>\n                <\/div>/,
  '{streakDays}d\n                    </span>\n                  )}\n                </div>'
);

// Fix 3: userProfile isSignedIn
code = code.replace(
  /<span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" \/>\n                <\/div>/,
  '<span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />\n                  )}\n                </div>'
);

fs.writeFileSync('src/components/MobileNavBar.tsx', code);
