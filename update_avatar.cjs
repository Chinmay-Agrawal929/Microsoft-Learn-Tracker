const fs = require('fs');
let code = fs.readFileSync('src/components/InteractiveCopilotAvatar.tsx', 'utf8');

// Add gender prop
code = code.replace(
  /interface InteractiveCopilotAvatarProps \{/,
  "interface InteractiveCopilotAvatarProps {\n  gender?: 'male' | 'female' | 'unspecified';"
);

code = code.replace(
  /export const InteractiveCopilotAvatar: React\.FC<InteractiveCopilotAvatarProps> = \(\{/,
  "export const InteractiveCopilotAvatar: React.FC<InteractiveCopilotAvatarProps> = ({\n  gender = 'unspecified',"
);

// We need to add logic inside the face capsule based on gender.
// If gender is male/female, we replace the eyes and mouth with a stylized glowing silhouette.
const genderSilhouettes = `
          {/* Gender Silhouette Overrides */}
          {gender === 'male' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 z-20 pointer-events-none">
              {/* Abstract Male Head & Shoulders */}
              <div className="w-2.5 h-3 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-t-full rounded-b-md shadow-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-full mt-0.5 opacity-90 shadow-[0_-2px_10px_rgba(34,211,238,0.5)]" />
              {isThinking && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-b-2 border-cyan-300 rounded-full animate-spin" />
              )}
            </div>
          )}
          {gender === 'female' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 z-20 pointer-events-none">
              {/* Abstract Female Head & Shoulders (curved hair/bob shape) */}
              <div className="relative w-3.5 h-3.5 bg-gradient-to-b from-fuchsia-400 via-purple-500 to-indigo-500 rounded-full shadow-fuchsia-400/50 shadow-[0_0_10px_rgba(232,121,249,0.8)] flex items-center justify-center">
                 <div className="absolute bottom-0 w-2.5 h-2.5 bg-neutral-900 rounded-full border-t border-fuchsia-300/30" />
              </div>
              <div className="w-4 h-2 bg-gradient-to-t from-indigo-600 to-fuchsia-500 rounded-t-full mt-0.5 opacity-90 shadow-[0_-2px_10px_rgba(232,121,249,0.5)]" />
              {isThinking && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-b-2 border-fuchsia-300 rounded-full animate-spin" />
              )}
            </div>
          )}
          
          {/* Eyes Layer */}
`;

code = code.replace(
  /\{\/\* Eyes Layer \*\/\}/,
  genderSilhouettes
);

fs.writeFileSync('src/components/InteractiveCopilotAvatar.tsx', code);
