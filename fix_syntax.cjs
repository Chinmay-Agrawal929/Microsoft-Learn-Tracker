const fs = require('fs');
let code = fs.readFileSync('src/components/MicrosoftAuthModal.tsx', 'utf8');

const regex = /const handleMicrosoftOAuth = async \(\) => \{[\s\S]*?setIsLoading\(false\);\n\s*\}\n\s*\};\n\) => clearInterval\(interval\);/m;

code = code.replace(regex, 'return () => clearInterval(interval);');

const handleMicrosoftOAuth = `
  const handleMicrosoftOAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      onSaveProfile({
        name: result.user.displayName || 'Learner',
        email: result.user.email || '',
        accountType: 'Personal Microsoft Account',
        organization: '',
        isSignedIn: true,
      });
      setSuccessMessage('Successfully connected to Microsoft!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to Microsoft.');
    } finally {
      setIsLoading(false);
    }
  };
`;

code = code.replace(/if \(\!isOpen\) return null;/, handleMicrosoftOAuth + '\n\n  if (!isOpen) return null;');

fs.writeFileSync('src/components/MicrosoftAuthModal.tsx', code);
