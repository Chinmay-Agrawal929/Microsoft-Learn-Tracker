const fs = require('fs');

let auth = fs.readFileSync('src/components/MicrosoftAuthModal.tsx', 'utf8');

// Add regGender and editGender states
auth = auth.replace(
  /const \[regOrganization, setRegOrganization\] = useState\(''\);/,
  "const [regOrganization, setRegOrganization] = useState('');\n  const [regGender, setRegGender] = useState<'male' | 'female' | 'unspecified'>('unspecified');"
);

auth = auth.replace(
  /const \[editAvatarUrl, setEditAvatarUrl\] = useState\(''\);/,
  "const [editAvatarUrl, setEditAvatarUrl] = useState('');\n  const [editGender, setEditGender] = useState<'male' | 'female' | 'unspecified'>('unspecified');"
);

// Update init useEffect
auth = auth.replace(
  /setEditAvatarUrl\(userProfile.avatarUrl\);/,
  "setEditAvatarUrl(userProfile.avatarUrl);\n        setEditGender(userProfile.gender || 'unspecified');"
);

auth = auth.replace(
  /setRegOrganization\(''\);/,
  "setRegOrganization('');\n        setRegGender('unspecified');"
);

// Update Save Profile object
auth = auth.replace(
  /avatarUrl: editAvatarUrl \|\| userProfile\.avatarUrl,/,
  "avatarUrl: editAvatarUrl || userProfile.avatarUrl,\n                          gender: editGender,"
);

auth = auth.replace(
  /avatarUrl: regAvatarUrl,/,
  "avatarUrl: regAvatarUrl,\n          gender: regGender,"
);

fs.writeFileSync('src/components/MicrosoftAuthModal.tsx', auth);
