import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Lock, Mail, CheckCircle2, Shield, User, Building, ArrowRight,
  Eye, EyeOff, KeyRound, AlertTriangle, Smartphone, Sparkles, RefreshCw,
  HelpCircle, ArrowLeft, Check, Laptop, UserPlus, LogIn, Briefcase,
  Compass, BadgeCheck
} from 'lucide-react';
import { auth, microsoftProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from '../lib/firebase';
import { UserProfile } from '../types';
import { AvatarPicker } from './AvatarPicker';

interface MicrosoftAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
}

type AuthView = 'signin_email' | 'signin_password' | 'authenticator' | 'kmsi' | 'create_account' | 'profile_customizer';

const POPULAR_ROLES = [
  'Cloud Solutions Architect',
  'Azure AI & ML Engineer',
  'Cloud DevOps Engineer',
  'Azure Security Specialist',
  'Enterprise Data Engineer',
  'Azure Administrator',
  'Student / Cloud Aspirant'
];

export const MicrosoftAuthModal: React.FC<MicrosoftAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  // Primary view state
  const [view, setView] = useState<AuthView>('signin_email');

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [accountType, setAccountType] = useState<'Work or School' | 'Personal Microsoft Account'>('Personal Microsoft Account');
  const [organization, setOrganization] = useState('');
  const [detectedTenant, setDetectedTenant] = useState('Microsoft Identity Platform');

  // Create Account inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRoleTitle, setRegRoleTitle] = useState('Cloud & AI Engineer');
  const [regAccountType, setRegAccountType] = useState<'Work or School' | 'Personal Microsoft Account'>('Personal Microsoft Account');
  const [regOrganization, setRegOrganization] = useState('');
  const [regGender, setRegGender] = useState<'male' | 'female' | 'unspecified'>('unspecified');
  const [regAvatarUrl, setRegAvatarUrl] = useState(userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // Authenticator 2FA Simulation State
  const [authNumber, setAuthNumber] = useState<number>(47);
  const [authTimer, setAuthTimer] = useState<number>(30);
  const [is2FaApproved, setIs2FaApproved] = useState<boolean>(false);

  // Profile Edit State (when logged in)
  const [editName, setEditName] = useState('');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editOrganization, setEditOrganization] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female' | 'unspecified'>('unspecified');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setAuthNumber(Math.floor(10 + Math.random() * 89));
      setAuthTimer(30);
      setIs2FaApproved(false);

      if (userProfile.isSignedIn) {
        setView('profile_customizer');
        setEditName(userProfile.name || '');
        setEditRoleTitle(userProfile.roleTitle || 'Cloud & AI Engineer');
        setEditOrganization(userProfile.organization || '');
        setEditAvatarUrl(userProfile.avatarUrl);
        setEditGender(userProfile.gender || 'unspecified');
      } else {
        setView('signin_email');
        setSignInEmail(userProfile.email || '');
        setSignInPassword('');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegRoleTitle('Cloud & AI Engineer');
        setRegOrganization('');
        setRegGender('unspecified');
      }
    }
  }, [isOpen, userProfile.isSignedIn]);

  // Authenticator timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === 'authenticator' && authTimer > 0 && !is2FaApproved) {
      interval = setInterval(() => {
        setAuthTimer((prev) => prev - 1);
      }, 1000);
    }
    
  return () => clearInterval(interval);
  }, [view, authTimer, is2FaApproved]);

  
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


  if (!isOpen) return null;

  // Step 1: Validate Email in Sign-in flow
  
    const handleGuestLogin = () => {
    onSaveProfile({
      name: 'Guest Learner',
      email: 'guest@microsoft.learn',
      accountType: 'Personal Microsoft Account',
      organization: '',
      isSignedIn: true,
    });
    setSuccessMessage('Entering as Guest...');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 600);
  };

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


  // Step 2: Handle Password Submit in Sign-in
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInPassword || signInPassword.length < 1) {
      setErrorMessage('Please enter your password.');
      return;
    }
    setErrorMessage('');
    setView('kmsi');
  };

  // Step 3: Handle Authenticator 2FA approval
  const handleApproveAuthenticator = () => {
    setIs2FaApproved(true);
    setTimeout(() => {
      setView('kmsi');
    }, 700);
  };

  // Step 4: Finish KMSI & Complete Sign In
  
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
        setErrorMessage('----------This E-mail DO NOT EXIST So Try By Any Other Account Or Else Create  a New Account !!! ----------');
      } else {
        setErrorMessage(err.message || 'Sign in error');
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Step 5: Handle Create Account Registration
  
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

      setSuccessMessage(`Welcome, ${cleanName}! Your Microsoft Account is ready.`);
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


  // Step 6: Handle Sign Out
  
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


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-5 sm:p-7 overflow-hidden z-10 max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Microsoft 4-Square Branding Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6 p-0.5 rounded shadow-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="bg-[#F25022] rounded-xs" />
                <div className="bg-[#7FBA00] rounded-xs" />
                <div className="bg-[#00A4EF] rounded-xs" />
                <div className="bg-[#FFB900] rounded-xs" />
              </div>
              <span className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight">
                Microsoft <span className="font-normal text-neutral-500 dark:text-neutral-400">Account</span>
              </span>
            </div>
          </div>

          {/* Tab Switcher if not signed in and at initial screens */}
          {!userProfile.isSignedIn && (view === 'signin_email' || view === 'create_account') && (
            <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 mb-5 border border-neutral-200/70 dark:border-neutral-700/70">
              <button
                type="button"
                onClick={() => {
                  setView('signin_email');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  view === 'signin_email'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setView('create_account');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  view === 'create_account'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </motion.div>
          )}

          {/* Content scroll area */}
          <div className="overflow-y-auto flex-1 pr-1 -mr-1 space-y-4">
            {/* ================= 1. SIGN IN: EMAIL ================= */}
            {view === 'signin_email' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Sign in
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    to track your certifications, XP, and study milestones
                  </p>
                </div>

                <form onSubmit={handleValidateSignInEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="microsoft-signin-email"
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="Enter your email (e.g. name@outlook.com or work email)"
                        className="w-full px-3.5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      No account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setView('create_account');
                          setErrorMessage('');
                        }}
                        className="text-[#0078D4] dark:text-[#2899F5] hover:underline font-semibold"
                      >
                        Create one!
                      </button>
                    </span>

                    <button
                      id="microsoft-email-submit"
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] active:bg-[#005ba3] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
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

                      <button
                        type="button"
                        onClick={handleGuestLogin}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
                      >
                        <User className="w-4 h-4" />
                        <span>Enter for free (Guest)</span>
                      </button>
                    </div>
                  </div>

            )}

            {/* ================= 2. SIGN IN: PASSWORD ================= */}
            {view === 'signin_password' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setView('signin_email')}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[260px] font-medium">{signInEmail}</span>
                </button>

                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Enter password
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Authenticating with <span className="font-semibold text-neutral-700 dark:text-neutral-300">{accountType}</span>
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      id="microsoft-signin-password"
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Alternate Authenticator option */}
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#0078D4]" />
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                        Microsoft Authenticator
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setView('authenticator')}
                      className="text-xs text-[#0078D4] dark:text-[#2899F5] font-semibold hover:underline"
                    >
                      Send 2FA push
                    </button>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setView('signin_email')}
                      className="text-xs text-neutral-500 hover:underline"
                    >
                      Use another account
                    </button>

                    <button
                      id="microsoft-password-submit"
                      type="submit"
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] active:bg-[#005ba3] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                    >
                      <span>Sign in</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= 3. SIGN IN: AUTHENTICATOR 2FA ================= */}
            {view === 'authenticator' && (
              <div className="space-y-5 text-center py-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0078D4]">
                  <Smartphone className="w-7 h-7 animate-bounce" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Approve sign-in request
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                    Open your Microsoft Authenticator app and select the matching number:
                  </p>
                </div>

                {/* Matching Number Card */}
                <div className="inline-block p-4 px-8 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl">
                  <span className="text-4xl font-extrabold tracking-widest">{authNumber}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0078D4]" />
                  <span>Waiting for approval ({authTimer}s)...</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApproveAuthenticator}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Sign-in Request</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('signin_password')}
                    className="w-full py-2 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                  >
                    Enter password instead
                  </button>
                </div>
              </div>
            )}

            {/* ================= 4. SIGN IN: KMSI ("STAY SIGNED IN?") ================= */}
            {view === 'kmsi' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Stay signed in?
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                    Keep your Microsoft Learn certification progress, daily study streaks, XP milestones, and custom tasks safely synchronized.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
                  <Laptop className="w-5 h-5 text-[#0078D4] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-700 dark:text-neutral-300">
                    <p className="font-semibold text-neutral-900 dark:text-white">Encrypted Session Token</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Your learning session will stay authenticated on this browser.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleCompleteSignIn(false)}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    No
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCompleteSignIn(true)}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Yes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ================= 5. CREATE ACCOUNT ("CREATE ONE") ================= */}
            {view === 'create_account' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Set up your Microsoft Learn profile & track your learning journey
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4] transition-all"
                      />
                      <User className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. alex@outlook.com or alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4] transition-all"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0078D4] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className={`w-full px-3 py-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 transition-all ${
                          regConfirmPassword && regPassword !== regConfirmPassword
                            ? 'border-rose-400 focus:ring-rose-500'
                            : 'border-neutral-300 dark:border-neutral-700 focus:ring-[#0078D4]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Primary Role / Target Career */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Primary Career Goal / Role
                    </label>
                    <select
                      value={regRoleTitle}
                      onChange={(e) => setRegRoleTitle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0078D4] transition-all"
                    >
                      {POPULAR_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Type Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegAccountType('Personal Microsoft Account')}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col gap-0.5 ${
                          regAccountType === 'Personal Microsoft Account'
                            ? 'border-[#0078D4] bg-blue-50/70 dark:bg-blue-950/40 text-[#0078D4] dark:text-[#2899F5] font-bold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className="font-semibold flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Personal Account
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal">Outlook, Live, Gmail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegAccountType('Work or School')}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col gap-0.5 ${
                          regAccountType === 'Work or School'
                            ? 'border-[#0078D4] bg-blue-50/70 dark:bg-blue-950/40 text-[#0078D4] dark:text-[#2899F5] font-bold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className="font-semibold flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" /> Work or School
                        </span>
                        <span className="text-[10px] text-neutral-500 font-normal">Microsoft Entra / Org</span>
                      </button>
                    </div>
                  </div>

                  {/* Organization (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Organization / Company <span className="text-[10px] text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={regOrganization}
                      onChange={(e) => setRegOrganization(e.target.value)}
                      placeholder="e.g. Contoso Cloud or University"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
                    />
                  </div>
                  {/* Gender (For AI Avatar) */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Gender (Customizes your AI Copilot) <span className="text-[10px] text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0078D4] appearance-none"
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Avatar Picker */}
                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Choose Profile Avatar
                    </label>
                    <AvatarPicker
                      currentAvatarUrl={regAvatarUrl}
                      onSelectAvatar={(url) => setRegAvatarUrl(url)}
                    />
                  </div>

                  {/* Submit Button & Switch Link */}
                  <div className="pt-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setView('signin_email');
                        setErrorMessage('');
                      }}
                      className="text-xs text-[#0078D4] dark:text-[#2899F5] hover:underline font-semibold"
                    >
                      Already have an account? Sign in
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] active:bg-[#005ba3] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================= 6. PROFILE CUSTOMIZER (WHEN SIGNED IN) ================= */}
            {view === 'profile_customizer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      Microsoft Learn Profile
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage your profile information and avatar
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Signed In
                  </span>
                </div>

                {/* Avatar Picker */}
                <div>
                  <AvatarPicker
                    currentAvatarUrl={editAvatarUrl || userProfile.avatarUrl}
                    onSelectAvatar={(url) => setEditAvatarUrl(url)}
                  />
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Role & Title
                    </label>
                    <input
                      type="text"
                      value={editRoleTitle}
                      onChange={(e) => setEditRoleTitle(e.target.value)}
                      placeholder="e.g. Cloud Solutions Architect"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Organization / Tenant
                    </label>
                    <input
                      type="text"
                      value={editOrganization}
                      onChange={(e) => setEditOrganization(e.target.value)}
                      placeholder="e.g. Contoso Cloud or Personal"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Gender (Customizes your AI Copilot)
                    </label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#0078D4]"
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                  >
                    Sign Out
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('signin_email');
                        setSignInEmail('');
                        setSignInPassword('');
                      }}
                      className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Switch Account
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSaveProfile({
                          name: editName.trim() || userProfile.name,
                          roleTitle: editRoleTitle.trim() || userProfile.roleTitle,
                          organization: editOrganization.trim(),
                          avatarUrl: editAvatarUrl || userProfile.avatarUrl,
                          gender: editGender,
                        });
                        setSuccessMessage('Profile saved!');
                        setTimeout(() => {
                          setSuccessMessage('');
                          onClose();
                        }, 700);
                      }}
                      className="px-5 py-2 rounded-xl bg-[#0078D4] text-white text-xs font-bold hover:bg-[#006cbd] shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
