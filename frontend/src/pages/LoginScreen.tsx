import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Shield, Zap, TrendingUp, Lock } from 'lucide-react';

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 finmate-gradient opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative mb-8 animate-fade-in">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-glow">
            <img
              src="/assets/generated/finmate-logo.dim_256x256.png"
              alt="FinMate"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">FinMate</h1>
          <p className="text-muted-foreground text-lg">Your Smart Finance Companion</p>
        </div>

        {/* Features */}
        <div className="w-full max-w-sm space-y-3 mb-10 animate-slide-up">
          {[
            { icon: TrendingUp, text: 'Track all your transactions', color: 'text-primary' },
            { icon: Zap, text: 'AI-powered spending insights', color: 'text-accent' },
            { icon: Shield, text: 'Bank-grade security', color: 'text-primary' },
            { icon: Lock, text: 'PIN & biometric protection', color: 'text-accent' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-3 bg-card border border-border/50 rounded-xl px-4 py-3">
              <div className={`${color} bg-primary/10 p-2 rounded-lg`}>
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-foreground">{text}</span>
            </div>
          ))}
        </div>

        {/* Login Button */}
        <div className="w-full max-w-sm animate-slide-up">
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="btn-primary w-full text-center flex items-center justify-center gap-2 text-base"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Lock size={18} />
                Login with Internet Identity
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Secure, decentralized authentication
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>
          Built with{' '}
          <span className="text-red-500">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'finmate-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} FinMate. All rights reserved.</p>
      </footer>
    </div>
  );
}
