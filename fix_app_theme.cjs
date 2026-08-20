const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /localStorage\.setItem\('mslearn_theme', 'light'\);/,
  "localStorage.setItem('mslearn_theme', theme);"
);

app = app.replace(
  /onSetTheme\?: \(t: 'light' \| 'dark' \| 'neon'\) => void;/,
  "onSetTheme?: (t: string) => void;"
);

fs.writeFileSync('src/App.tsx', app);
