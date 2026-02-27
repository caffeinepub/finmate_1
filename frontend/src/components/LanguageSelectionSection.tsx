import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Mandarin', native: '普通话', flag: '🇨🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
];

export default function LanguageSelectionSection() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(() => localStorage.getItem('finmate_language') || 'en');

  const handleSelect = (code: string) => {
    setSelected(code);
    localStorage.setItem('finmate_language', code);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-foreground">Language</span>
            <p className="text-xs text-muted-foreground">{LANGUAGES.find(l => l.code === selected)?.name || 'English'}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  selected === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-xs text-muted-foreground">{lang.native}</p>
                </div>
                {selected === lang.code && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
            <p className="text-xs text-amber-700 dark:text-amber-300">🌐 Full multi-language support is coming soon! Currently, the app is available in English only.</p>
          </div>
        </div>
      )}
    </div>
  );
}
