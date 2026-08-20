const fs = require('fs');
let code = fs.readFileSync('src/components/CopilotWidget.tsx', 'utf8');

code = code.replace(
  /import \{([^}]+)\} from 'lucide-react';/,
  "import { $1, Paperclip, Brain } from 'lucide-react';"
);

fs.writeFileSync('src/components/CopilotWidget.tsx', code);
