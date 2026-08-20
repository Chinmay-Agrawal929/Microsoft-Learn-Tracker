const fs = require('fs');
let code = fs.readFileSync('src/components/InteractiveCopilotAvatar.tsx', 'utf8');

// Hide robot face if gender is set
code = code.replace(
  /className=\{`flex items-center \$\{dimensions\.spacing\} z-10 transition-transform \$\{/,
  "className={`flex items-center ${dimensions.spacing} z-10 transition-transform ${gender !== 'unspecified' ? 'hidden' : ''} ${"
);

code = code.replace(
  /\{\/\* Expressive Mouth \/ Smile \*\/\}\n          <div className="mt-0\.5 z-10 flex items-center justify-center">/,
  `{/* Expressive Mouth / Smile */}
          <div className={\`mt-0.5 z-10 flex items-center justify-center \${gender !== 'unspecified' ? 'hidden' : ''}\`}>`
);

code = code.replace(
  /\{\/\* Cheerful Rosy Blushing Cheeks when Happy or Cheering \*\/\}\n          \{\(isHovered \|\| activeExpression === 'happy' \|\| activeExpression === 'cheering'\) && \(/,
  `{/* Cheerful Rosy Blushing Cheeks when Happy or Cheering */}
          {(isHovered || activeExpression === 'happy' || activeExpression === 'cheering') && gender === 'unspecified' && (`
);

fs.writeFileSync('src/components/InteractiveCopilotAvatar.tsx', code);
