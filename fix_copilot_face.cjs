const fs = require('fs');
let code = fs.readFileSync('src/components/CopilotWidget.tsx', 'utf8');

// Fix 1: Add enableInteractivePokes={false} to the small floating avatar
code = code.replace(
  /<InteractiveCopilotAvatar size="sm" gender=\{userGender\} \/>/,
  '<InteractiveCopilotAvatar size="sm" gender={userGender} enableInteractivePokes={false} />'
);

// Fix 2: Add isDeepReasoning to the handleSendMessage fetch body
code = code.replace(
  /body: JSON\.stringify\(\{\n\s*message: text\.trim\(\),/,
  `body: JSON.stringify({\n          isDeepReasoning,\n          message: text.trim(),`
);

fs.writeFileSync('src/components/CopilotWidget.tsx', code);
