import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import AIChatbotOverlay from './AIChatbotOverlay';

export default function AIChatbotFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-glow flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
          aria-label="Open AI Chatbot"
        >
          <img
            src="/assets/generated/ai-avatar.dim_96x96.png"
            alt="AI"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const sibling = (e.target as HTMLImageElement).nextElementSibling;
              if (sibling) sibling.classList.remove('hidden');
            }}
          />
          <MessageCircle size={22} className="text-white hidden" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <AIChatbotOverlay onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
