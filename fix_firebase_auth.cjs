const fs = require('fs');
let code = fs.readFileSync('src/components/MicrosoftAuthModal.tsx', 'utf8');

const imports = `import { auth, microsoftProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from '../lib/firebase';`;

code = code.replace(/import \{ UserProfile \} from '\.\.\/types';/, imports + "\nimport { UserProfile } from '../types';");

// Update handleCompleteSignIn (Password Submit)
const newCompleteSignIn = `
  const handleCompleteSignIn = async (keepSignedIn: boolean = true) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Use Firebase Auth to sign in
      const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      
      onSaveProfile({
        name: userCredential.user.displayName || 'Learner',
        email: userCredential.user.email || signInEmail,
        accountType: 'Personal Microsoft Account',
        organization: '',
        isSignedIn: true,
      });

      setSuccessMessage('Signed in successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 900);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('This email DOES NOT EXIST in our system or the password is wrong. Please create a new account.');
      } else {
        setErrorMessage(err.message || 'Sign in error');
      }
    } finally {
      setIsLoading(false);
    }
  };
`;

code = code.replace(/const handleCompleteSignIn = async \([\s\S]*?setIsLoading\(false\);\n\s*\}\n\s*\};/, newCompleteSignIn);

// Update Validate Email (just move to password screen)
const newValidateEmail = `
  const handleValidateSignInEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = signInEmail.trim();

    if (!targetEmail || !targetEmail.includes('@') || !targetEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setView('signin_password');
  };
`;

code = code.replace(/const handleValidateSignInEmail = async \([\s\S]*?setIsLoading\(false\);\n\s*\}\n\s*\};/, newValidateEmail);

// Update Register
const newRegister = `
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, regPassword);

      onSaveProfile({
        name: cleanName,
        email: cleanEmail,
        roleTitle: regRoleTitle,
        accountType: regAccountType,
        organization: regOrganization,
        avatarUrl: regAvatarUrl,
        isSignedIn: true,
      });

      setSuccessMessage(\`Welcome, \${cleanName}! Your Microsoft Account is ready.\`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in instead.');
      } else {
        setErrorMessage(err.message || 'Registration error');
      }
    } finally {
      setIsLoading(false);
    }
  };
`;

code = code.replace(/const handleRegisterSubmit = async \([\s\S]*?setIsLoading\(false\);\n\s*\}\n\s*\};/, newRegister);

// Update Sign Out
const newSignOut = `
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      onSaveProfile({
        name: 'Learner',
        email: '',
        isSignedIn: false,
        organization: '',
      });
      setView('signin_email');
      setSignInEmail('');
      setSignInPassword('');
      setSuccessMessage('Signed out successfully.');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
`;

code = code.replace(/const handleSignOut = async \([\s\S]*?console\.error\('Logout error:', err\);\n\s*\}\n\s*\};/, newSignOut);

// Add Microsoft OAuth Button
const microsoftOAuth = `
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

code = code.replace(/return \(/, microsoftOAuth + "\\n  return (");

// Add Microsoft button to UI
const buttonHtml = `
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={handleMicrosoftOAuth}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                      >
                        <div className="grid grid-cols-2 gap-[1px] w-4 h-4 p-[1px] rounded-[1px] bg-white dark:bg-neutral-900">
                          <div className="bg-[#F25022]" />
                          <div className="bg-[#7FBA00]" />
                          <div className="bg-[#00A4EF]" />
                          <div className="bg-[#FFB900]" />
                        </div>
                        <span>Sign in with Microsoft Learn</span>
                      </button>
                    </div>
                  </div>
`;

code = code.replace(/<\/form>\n\s*<\/div>\n\s*\)\}/, `</form>\n${buttonHtml}\n            )}`);

fs.writeFileSync('src/components/MicrosoftAuthModal.tsx', code);
