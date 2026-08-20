const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const themeType = "'light' | 'dark' | 'neon' | 'chrome-classic' | 'chrome-midnight' | 'chrome-mint' | 'chrome-rose' | 'chrome-lavender'";

app = app.replace(
  /useState<'light' \| 'dark' \| 'neon'>/,
  `useState<${themeType}>`
);

app = app.replace(
  /stored === 'dark' \|\| stored === 'neon' \|\| stored === 'light'/,
  "['light', 'dark', 'neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender'].includes(stored)"
);

app = app.replace(
  /as 'dark' \| 'light' \| 'neon'/,
  `as ${themeType}`
);

app = app.replace(
  /if \(theme === 'dark' \|\| theme === 'neon'\) \{/,
  "if (theme !== 'light' && theme !== 'chrome-classic' && theme !== 'chrome-mint' && theme !== 'chrome-rose' && theme !== 'chrome-lavender') {"
);

app = app.replace(
  /document\.documentElement\.classList\.remove\('neon'\);/,
  "document.documentElement.classList.remove('neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender');"
);

app = app.replace(
  /if \(theme === 'neon'\) \{\n\s*document\.documentElement\.classList\.add\('neon'\);\n\s*\} else \{\n\s*document\.documentElement\.classList\.remove\('neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender'\);\n\s*\}/,
  `document.documentElement.classList.remove('neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender');
      if (theme !== 'dark' && theme !== 'light') {
        document.documentElement.classList.add(theme);
      }`
);

app = app.replace(
  /document\.documentElement\.classList\.remove\('dark'\);\n\s*document\.documentElement\.classList\.remove\('neon'\);/,
  "document.documentElement.classList.remove('dark', 'neon', 'chrome-classic', 'chrome-midnight', 'chrome-mint', 'chrome-rose', 'chrome-lavender');\n      if (theme !== 'light') document.documentElement.classList.add(theme);"
);

// We need to pass the new ThemeType to SettingsModal and Navbar.
// Let's just create a shared type or rely on inline types.

fs.writeFileSync('src/App.tsx', app);
