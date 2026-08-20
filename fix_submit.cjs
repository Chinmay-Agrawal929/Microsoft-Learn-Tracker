const fs = require('fs');
let code = fs.readFileSync('src/components/CopilotWidget.tsx', 'utf8');

code = code.replace(
  /body: JSON\.stringify\(\{/,
  `body: JSON.stringify({\n          isDeepReasoning,`
);

fs.writeFileSync('src/components/CopilotWidget.tsx', code);
