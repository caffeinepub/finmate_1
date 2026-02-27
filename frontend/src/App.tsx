import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { usePinAuth } from './hooks/usePinAuth';
import PinSetup from './pages/PinSetup';
import PinEntry from './pages/PinEntry';
import MainApp from './pages/MainApp';
import LoginScreen from './pages/LoginScreen';
import ProfileSetupModal from './components/ProfileSetupModal';

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { isPinSet, verifyPin, setupPin, simulateBiometric } = usePinAuth();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [appUnlocked, setAppUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (isAuthenticated && profileFetched && userProfile === null) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileFetched, userProfile]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow">
            <img src="/assets/generated/finmate-logo.dim_256x256.png" alt="FinMate" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // If PIN not set yet, show setup
  if (!isPinSet) {
    return (
      <PinSetup
        onSetup={(pin) => {
          setupPin(pin);
          setAppUnlocked(true);
        }}
      />
    );
  }

  // If PIN is set but app not unlocked, show entry
  if (!appUnlocked) {
    return (
      <PinEntry
        onVerify={(pin) => {
          const ok = verifyPin(pin);
          if (ok) {
            setAppUnlocked(true);
            setPinError(null);
          } else {
            setPinError('Incorrect PIN. Please try again.');
          }
          return ok;
        }}
        onBiometric={async () => {
          const ok = await simulateBiometric();
          if (ok) setAppUnlocked(true);
          return ok;
        }}
        error={pinError}
        clearError={() => setPinError(null)}
      />
    );
  }

  return (
    <>
      <MainApp />
      {showProfileSetup && (
        <ProfileSetupModal
          onClose={() => setShowProfileSetup(false)}
          isOpen={showProfileSetup}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppContent />
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
